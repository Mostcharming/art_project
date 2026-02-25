const { Publisher } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');
const { generateVerificationCode } = require('../../utils/verificationCode');
const emailMiddleware = require('../../middleware/emailMiddleware');
const crypto = require('crypto');

exports.signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existingPublisher = await Publisher.findOne({ where: { email: normalizedEmail } });
        if (existingPublisher) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await hashPassword(password);
        const verificationCode = generateVerificationCode();

        const publisher = await Publisher.create({
            email: normalizedEmail,
            password: hashedPassword,
            verificationToken: verificationCode,
            verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
            isEmailVerified: false,
            accountSetupComplete: false,
        });

        try {
            await emailMiddleware.sendVerificationEmail(normalizedEmail, verificationCode, normalizedEmail.split('@')[0]);
        } catch (emailError) {
            console.warn('Email sending failed, but account created:', emailError);
        }

        res.status(201).json({
            message: 'Publisher account created. Please verify your email with the 4-digit code sent to your email.',
            publisher: {
                id: publisher.id,
                email: publisher.email,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({ error: 'Email and verification code are required' });
        }

        const publisher = await Publisher.findOne({
            where: {
                email,
                verificationToken: verificationCode,
                verificationTokenExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!publisher) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        await publisher.update({
            isEmailVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
        });

        const authToken = generateToken({
            id: publisher.id,
            email: publisher.email,
            type: 'publisher',
        });

        // try {
        //     await emailMiddleware.sendWelcomeEmail(email, email.split('@')[0]);
        // } catch (emailError) {
        //     console.warn('Welcome email sending failed:', emailError);
        // }

        res.json({
            message: 'Email verified successfully. Complete your profile to finish setup.',
            authToken,
            publisher: {
                id: publisher.id,
                email: publisher.email,
                isEmailVerified: true,
                accountSetupComplete: false,
            },
        });
    } catch (error) {
        console.error('Verify email error:', error);
        next(error);
    }
};

exports.resendVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const publisher = await Publisher.findOne({ where: { email } });
        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        if (publisher.isEmailVerified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        const verificationCode = generateVerificationCode();

        await publisher.update({
            verificationToken: verificationCode,
            verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
        });

        try {
            await emailMiddleware.sendResendVerificationEmail(email, verificationCode, email.split('@')[0]);
        } catch (emailError) {
            console.warn('Resend verification email failed:', emailError);
        }

        res.json({
            message: 'Verification code has been resent to your email.',
        });
    } catch (error) {
        console.error('Resend verification code error:', error);
        next(error);
    }
};

exports.completeProfileSetup = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        const { personaType, name, country, bio } = req.body;

        if (!personaType || !name || !country) {
            return res.status(400).json({
                error: 'personaType, name, and country are required'
            });
        }

        const publisher = await Publisher.findByPk(publisherId);
        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        if (!publisher.isEmailVerified) {
            return res.status(403).json({ error: 'Please verify your email first' });
        }

        await publisher.update({
            personaType,
            name,
            country,
            bio: bio || null,
            accountSetupComplete: true,
        });

        res.json({
            message: 'Profile setup completed successfully',
            publisher: {
                id: publisher.id,
                email: publisher.email,
                personaType: publisher.personaType,
                name: publisher.name,
                country: publisher.country,
                bio: publisher.bio,
                accountSetupComplete: true,
            },
        });
    } catch (error) {
        console.error('Complete profile setup error:', error);
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const publisherId = req.user.id;

        const publisher = await Publisher.findByPk(publisherId, {
            attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] }
        });

        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        res.json(publisher);
    } catch (error) {
        console.error('Get profile error:', error);
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }


        const publisher = await Publisher.findOne({ where: { email } });
        if (!publisher) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePassword(password, publisher.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!publisher.isEmailVerified) {
            return res.status(403).json({ error: 'Please verify your email before logging in' });
        }



        const token = generateToken({
            id: publisher.id,
            email: publisher.email,
            type: 'publisher',
        });

        res.json({
            message: 'Login successful',
            token,
            publisher: {
                id: publisher.id,
                email: publisher.email,
                personaType: publisher.personaType,
                name: publisher.name,
                accountSetupComplete: publisher.accountSetupComplete,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const publisher = await Publisher.findOne({ where: { email } });
        if (!publisher) {
            return res.json({ message: 'If this email exists, a reset code has been sent' });
        }

        const resetCode = generateVerificationCode();

        await publisher.update({
            resetPasswordToken: resetCode,
            resetPasswordTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
        });

        try {
            await emailMiddleware.sendPasswordResetEmail(email, resetCode, email.split('@')[0]);
        } catch (emailError) {
            console.warn('Password reset email failed:', emailError);
        }

        res.json({
            message: 'A 4-digit reset code has been sent to your email',
        });
    } catch (error) {
        console.error('Request password reset error:', error);
        next(error);
    }
};

exports.verifyResetToken = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email and reset code are required' });
        }

        const publisher = await Publisher.findOne({
            where: {
                email,
                resetPasswordToken: code,
                resetPasswordTokenExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!publisher) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }

        const resetSessionToken = crypto.randomBytes(32).toString('hex');

        await publisher.update({
            resetPasswordToken: resetSessionToken,
            resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
        });

        res.json({
            message: 'Reset code verified successfully',
            resetSessionToken,
        });
    } catch (error) {
        console.error('Verify reset token error:', error);
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { resetSessionToken, newPassword } = req.body;

        if (!resetSessionToken || !newPassword) {
            return res.status(400).json({ error: 'Reset session token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const publisher = await Publisher.findOne({
            where: {
                resetPasswordToken: resetSessionToken,
                resetPasswordTokenExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!publisher) {
            return res.status(400).json({ error: 'Invalid or expired reset session. Please restart the password reset process.' });
        }

        const hashedPassword = await hashPassword(newPassword);

        await publisher.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpires: null,
        });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        next(error);
    }
};

// Update publisher profile (name, personaType, country, bio, password)
exports.updateProfile = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        const { name, personaType, country, bio, password } = req.body;

        const publisher = await Publisher.findByPk(publisherId);
        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        const updateData = {
            name: name || publisher.name,
            personaType: personaType || publisher.personaType,
            country: country || publisher.country,
            bio: bio !== undefined ? bio : publisher.bio,
        };

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            updateData.password = await hashPassword(password);
        }

        await publisher.update(updateData);

        res.json({
            message: 'Profile updated successfully',
            publisher: {
                id: publisher.id,
                email: publisher.email,
                name: publisher.name,
                personaType: publisher.personaType,
                country: publisher.country,
                bio: publisher.bio,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        next(error);
    }
};
