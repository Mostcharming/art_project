const { Viewer } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, vibePreference, appUsage, styles } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingViewer = await Viewer.findOne({ where: { email } });
        if (existingViewer) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await hashPassword(password);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const viewer = await Viewer.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            vibePreference,
            appUsage,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isVerified: false,
        });

        if (styles && Array.isArray(styles) && styles.length > 0) {
            await viewer.addStyles(styles);
        }

        res.status(201).json({
            message: 'Viewer registered successfully. Please verify your email.',
            viewer: {
                id: viewer.id,
                email: viewer.email,
                firstName: viewer.firstName,
                lastName: viewer.lastName,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const viewer = await Viewer.findOne({ where: { email } });
        if (!viewer) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!viewer.isVerified) {
            return res.status(403).json({ error: 'Please verify your email before logging in' });
        }

        const isPasswordValid = await comparePassword(password, viewer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken({
            id: viewer.id,
            email: viewer.email,
            type: 'viewer',
        });

        res.json({
            message: 'Login successful',
            token,
            viewer: {
                id: viewer.id,
                email: viewer.email,
                firstName: viewer.firstName,
                lastName: viewer.lastName,
                vibePreference: viewer.vibePreference,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        const viewer = await Viewer.findOne({
            where: {
                verificationToken: token,
                verificationTokenExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!viewer) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        await viewer.update({
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
        });

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        next(error);
    }
};

exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const viewer = await Viewer.findOne({ where: { email } });
        if (!viewer) {
            return res.json({ message: 'If this email exists, a reset link has been sent' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        await viewer.update({
            resetPasswordToken: resetToken,
            resetPasswordTokenExpires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        res.json({
            message: 'Password reset link has been sent to your email',
            resetToken,
        });
    } catch (error) {
        console.error('Request password reset error:', error);
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Reset token and new password are required' });
        }

        const viewer = await Viewer.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordTokenExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!viewer) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await hashPassword(newPassword);

        await viewer.update({
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
