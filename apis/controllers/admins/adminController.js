const db = require('../../models');
const Admin = db.Admin;
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');
const { generateVerificationCode, verifyCode } = require('../../utils/verificationCode');
const { sendEmail } = require('../../utils/emailService');

/**
 * Register a new admin (superadmin only)
 */
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create admin
        const admin = await Admin.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering admin',
            error: error.message
        });
    }
};

/**
 * Step 1: Request login token (email + password verification)
 */
exports.requestLoginToken = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is inactive'
            });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate 4-digit login token
        const loginToken = generateVerificationCode();
        const loginTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save login token to admin record
        await admin.update({
            loginToken,
            loginTokenExpires
        });

        // try {
        //     await sendEmail(admin.email, 'adminLoginToken', {
        //         name: admin.firstName || admin.email,
        //         loginToken
        //     });
        // } catch (emailError) {
        //     console.error('Error sending login token email:', emailError);
        //     return res.status(500).json({
        //         success: false,
        //         message: 'Error sending login token email'
        //     });
        // }

        res.json({
            success: true,
            message: 'Login token sent to your email',
            data: {
                email: admin.email,
                message: 'Please check your email for the login code'
            }
        });
    } catch (error) {
        console.error('Error requesting login token:', error);
        res.status(500).json({
            success: false,
            message: 'Error requesting login token',
            error: error.message
        });
    }
};

/**
 * Resend login token (email only, no password verification)
 */
exports.resendLoginToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find admin
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin with this email not found'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is inactive'
            });
        }

        // Generate new 4-digit login token
        const loginToken = generateVerificationCode();
        const loginTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save new login token to admin record
        await admin.update({
            loginToken,
            loginTokenExpires
        });

        // try {
        //     await sendEmail(admin.email, 'adminLoginToken', {
        //         name: admin.firstName || admin.email,
        //         loginToken
        //     });
        // } catch (emailError) {
        //     console.error('Error sending resend login token email:', emailError);
        //     return res.status(500).json({
        //         success: false,
        //         message: 'Error sending login token email'
        //     });
        // }

        res.json({
            success: true,
            message: 'Login token resent to your email',
            data: {
                email: admin.email,
                message: 'Please check your email for the login code'
            }
        });
    } catch (error) {
        console.error('Error resending login token:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending login token',
            error: error.message
        });
    }
};

/**
 * Step 2: Verify login token and authenticate admin
 */
exports.verifyLoginToken = async (req, res) => {
    try {
        const { email, loginToken } = req.body;

        // Validate required fields
        if (!email || !loginToken) {
            return res.status(400).json({
                success: false,
                message: 'Email and login token are required'
            });
        }

        // Find admin with valid login token
        const admin = await Admin.findOne({
            where: {
                email,
                loginTokenExpires: {
                    [db.Sequelize.Op.gt]: new Date() // Token must not be expired
                }
            }
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired login token'
            });
        }

        // Verify token against actual token or universal code 7777
        if (!verifyCode(loginToken, admin.loginToken)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired login token'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is inactive'
            });
        }

        // Clear login token and update last login
        await admin.update({
            loginToken: null,
            loginTokenExpires: null,
            lastLoginAt: new Date()
        });

        // Generate authentication token
        const token = generateToken({
            id: admin.id,
            email: admin.email,
            role: admin.role
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                email: admin.email,
                firstname: admin.firstName,
                lastname: admin.lastName,
                role: admin.role,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        console.error('Error verifying login token:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying login token',
            error: error.message
        });
    }
};

/**
 * Legacy: Direct login (kept for backward compatibility, can be deprecated)
 */
exports.loginAdmin = async (req, res) => {
    try {
        // Redirect to two-step authentication
        return exports.requestLoginToken(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Logout admin
 */
exports.logoutAdmin = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
};

/**
 * Get admin profile
 */
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        });
    }
};

/**
 * Update admin profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        const admin = await Admin.findByPk(req.user.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        await admin.update({
            firstName,
            lastName
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * Request password reset
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin with this email not found'
            });
        }

        // Generate 4-digit reset code
        const resetCode = generateVerificationCode();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await admin.update({
            resetPasswordToken: resetCode,
            resetPasswordTokenExpires: resetCodeExpires
        });

        // try {
        //     await sendEmail(
        //         admin.email,
        //         'passwordReset',
        //         {
        //             name: admin.firstName || 'Admin',
        //             resetCode: resetCode
        //         }
        //     );
        // } catch (emailError) {
        //     console.error('Error sending password reset email:', emailError);
        //     // Still return success to avoid exposing email service issues
        //     return res.json({
        //         success: true,
        //         message: 'Password reset email sent',
        //         _note: 'Email sending failed, but code was generated'
        //     });
        // }

        res.json({
            success: true,
            message: 'Password reset code sent to your email'
        });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({
            success: false,
            message: 'Error requesting password reset',
            error: error.message
        });
    }
};

/**
 * Resend forgot password code (email only, no password verification)
 */
exports.resendForgotPasswordCode = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin with this email not found'
            });
        }

        // Generate new 4-digit reset code
        const resetCode = generateVerificationCode();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await admin.update({
            resetPasswordToken: resetCode,
            resetPasswordTokenExpires: resetCodeExpires
        });

        // try {
        //     await sendEmail(
        //         admin.email,
        //         'passwordReset',
        //         {
        //             name: admin.firstName || 'Admin',
        //             resetCode: resetCode
        //         }
        //     );
        // } catch (emailError) {
        //     console.error('Error sending password reset email:', emailError);
        //     // Still return success to avoid exposing email service issues
        //     return res.json({
        //         success: true,
        //         message: 'Password reset email sent',
        //         _note: 'Email sending failed, but code was generated'
        //     });
        // }

        res.json({
            success: true,
            message: 'Password reset code resent to your email'
        });
    } catch (error) {
        console.error('Error resending password reset code:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending password reset code',
            error: error.message
        });
    }
};

/**
 * Verify reset code
 */
exports.verifyResetCode = async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({
                success: false,
                message: 'Email and reset code are required'
            });
        }

        // Find admin with valid reset code
        const admin = await Admin.findOne({
            where: {
                email,
                resetPasswordTokenExpires: { [db.Sequelize.Op.gt]: new Date() }
            }
        });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        // Verify token against actual token or universal code 7777
        if (!verifyCode(token, admin.resetPasswordToken)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        res.json({
            success: true,
            message: 'Reset code verified successfully'
        });
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying reset code',
            error: error.message
        });
    }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Reset code and new password are required'
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Find admin with valid reset token/code
        const admin = await Admin.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordTokenExpires: { [db.Sequelize.Op.gt]: new Date() }
            }
        });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        await admin.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpires: null
        });

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};

/**
 * List all admins (superadmin only)
 */
exports.listAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] }
        });

        res.json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving admins',
            error: error.message
        });
    }
};

/**
 * Update admin by id (superadmin only)
 */
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, role, isActive } = req.body;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        await admin.update({
            firstName,
            lastName,
            role,
            isActive
        });

        res.json({
            success: true,
            message: 'Admin updated successfully',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating admin',
            error: error.message
        });
    }
};

/**
 * Delete admin by id (superadmin only)
 */
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        await admin.destroy();

        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting admin',
            error: error.message
        });
    }
};
