const { Viewer } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');
const { verifyCode, generateVerificationCode } = require('../../utils/verificationCode');
const crypto = require('crypto');

// Helper function to check viewer status
const checkViewerStatus = async (viewer) => {
    if (viewer.status === 'banned') {
        return {
            isBlocked: true,
            statusCode: 403,
            message: `Your account has been banned${viewer.reasonForBan ? ': ' + viewer.reasonForBan : ''}`,
        };
    }

    if (viewer.status === 'suspended') {
        const now = new Date();
        const suspensionEndDate = viewer.suspensionEndDate;

        // Check if suspension period has ended
        if (suspensionEndDate && suspensionEndDate < now) {
            // Reactivate the account
            await viewer.update({ status: 'active' });
            return {
                isBlocked: false,
            };
        }

        // Still within suspension period
        if (suspensionEndDate && suspensionEndDate >= now) {
            return {
                isBlocked: true,
                statusCode: 403,
                message: `Your account is suspended until ${suspensionEndDate.toISOString()}${viewer.reasonForSuspension ? ': ' + viewer.reasonForSuspension : ''}`,
            };
        }
    }

    return {
        isBlocked: false,
    };
};

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingViewer = await Viewer.findOne({ where: { email } });
        if (existingViewer) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await hashPassword(password);
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const viewer = await Viewer.create({
            email,
            password: hashedPassword,
            verificationToken: verificationCode,
            verificationTokenExpires: verificationCodeExpires,
            isVerified: false,
            setupCompleted: false,
        });

        res.status(201).json({
            message: 'Account created. Please verify the 4-digit code sent to your email.',
            viewerId: viewer.id,
            email: viewer.email,
            verificationCode, // Send this to user (in production, send via email)
        });
    } catch (error) {
        console.error('Register error:', error);
        next(error);
    }
};

// Step 2: Verify email with 4-digit code and issue JWT
exports.verifyEmailAndIssueToken = async (req, res, next) => {
    try {
        const { viewerId, verificationCode } = req.body;

        if (!viewerId || !verificationCode) {
            return res.status(400).json({ error: 'viewerId and verification code are required' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        // Check if token is expired
        if (!viewer.verificationTokenExpires || viewer.verificationTokenExpires < new Date()) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Verify code
        if (!verifyCode(verificationCode, viewer.verificationToken)) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Mark as verified and record verification timestamp
        await viewer.update({
            isVerified: true,
            emailVerifiedAt: new Date(),
            verificationToken: null,
            verificationTokenExpires: null,
        });

        // Issue JWT token
        const token = generateToken({
            id: viewer.id,
            email: viewer.email,
            type: 'viewer',
        });

        res.json({
            message: 'Email verified successfully. Proceed to complete your profile.',
            token,
            viewer: {
                id: viewer.id,
                email: viewer.email,
                emailVerifiedAt: viewer.emailVerifiedAt,
            },
        });
    } catch (error) {
        console.error('Verify email error:', error);
        next(error);
    }
};

// Step 3: Submit preferred styles
exports.submitStyles = async (req, res, next) => {
    try {
        const { styles } = req.body;
        const viewerId = req.user?.id; // From JWT middleware

        if (!viewerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!styles || !Array.isArray(styles) || styles.length === 0) {
            return res.status(400).json({ error: 'At least one style must be selected' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        await viewer.addStyles(styles);

        res.json({
            message: 'Styles submitted successfully',
            viewerId: viewer.id,
        });
    } catch (error) {
        console.error('Submit styles error:', error);
        next(error);
    }
};

// Step 4: Submit vibe preference
exports.submitVibePreference = async (req, res, next) => {
    try {
        const { vibePreference } = req.body;
        const viewerId = req.user?.id; // From JWT middleware

        if (!viewerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (vibePreference === undefined || vibePreference === null) {
            return res.status(400).json({ error: 'Vibe preference is required' });
        }

        if (typeof vibePreference !== 'number' || vibePreference < 0 || vibePreference > 100) {
            return res.status(400).json({ error: 'Vibe preference must be a number between 0 and 100' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        await viewer.update({ vibePreference });

        res.json({
            message: 'Vibe preference submitted successfully',
            viewerId: viewer.id,
            vibePreference: viewer.vibePreference,
        });
    } catch (error) {
        console.error('Submit vibe preference error:', error);
        next(error);
    }
};

// Step 5: Submit app usage and complete setup
exports.submitAppUsageAndCompleteSetup = async (req, res, next) => {
    try {
        const { appUsage, firstName, lastName } = req.body;
        const viewerId = req.user?.id; // From JWT middleware

        if (!viewerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!appUsage) {
            return res.status(400).json({ error: 'App usage is required' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        // Mark setup as complete
        await viewer.update({
            appUsage,
            firstName: firstName || viewer.firstName,
            lastName: lastName || viewer.lastName,
            setupCompleted: true,
        });

        res.json({
            message: 'Profile setup completed successfully',
            viewer: {
                id: viewer.id,
                email: viewer.email,
                firstName: viewer.firstName,
                lastName: viewer.lastName,
                vibePreference: viewer.vibePreference,
                appUsage: viewer.appUsage,
                setupCompleted: viewer.setupCompleted,
            },
        });
    } catch (error) {
        console.error('Submit app usage error:', error);
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

        if (!viewer.setupCompleted) {
            return res.status(403).json({ error: 'Please complete your profile setup before logging in' });
        }

        const isPasswordValid = await comparePassword(password, viewer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check viewer status
        const statusCheck = await checkViewerStatus(viewer);
        if (statusCheck.isBlocked) {
            return res.status(statusCheck.statusCode).json({ error: statusCheck.message });
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
                appUsage: viewer.appUsage,
                isVerified: viewer.isVerified,
                setupCompleted: viewer.setupCompleted,
                status: viewer.status,
                createdAt: viewer.createdAt,
                updatedAt: viewer.updatedAt,
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

        const viewer = await Viewer.findOne({ where: { email } });
        if (!viewer) {
            return res.json({ message: 'If this email exists, a reset link has been sent' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        await viewer.update({
            resetPasswordToken: resetToken,
            resetPasswordTokenExpires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        // Commented out email sending
        // try {
        //     // Send email with reset token
        // } catch (emailError) {
        //     // Handle email error
        // }

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

        // Verify token against actual token or universal code 7777
        if (!verifyCode(token, viewer.resetPasswordToken)) {
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
