const db = require('../../models');
const Admin = db.Admin;
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');
const { generateVerificationCode, verifyCode } = require('../../utils/verificationCode');
const { sendEmail } = require('../../utils/emailService');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');
const { logActivity } = require('../../utils/adminActivityService');
const { get } = require('node:http');

/**
 * Register a new admin (superadmin only)
 */
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, roleId } = req.body;

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
            roleId
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                roleId: admin.roleId
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

        try {
            await sendEmail(admin.email, 'adminLoginToken', {
                name: admin.firstName || admin.email,
                loginToken
            });
        } catch (emailError) {
            console.error('Error sending login token email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error sending login token email'
            });
        }

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

        try {
            await sendEmail(admin.email, 'adminLoginToken', {
                name: admin.firstName || admin.email,
                loginToken
            });
        } catch (emailError) {
            console.error('Error sending resend login token email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error sending login token email'
            });
        }

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

        // Find admin with valid login token and include role with privileges
        const admin = await Admin.findOne({
            where: {
                email,
                loginTokenExpires: {
                    [db.Sequelize.Op.gt]: new Date() // Token must not be expired
                }
            },
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] } // Exclude join table attributes
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
            roleId: admin.roleId
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                id: admin.id,
                email: admin.email,
                firstname: admin.firstName,
                lastname: admin.lastName,
                roleId: admin.roleId,
                role: admin.roleDetails,
                profilePicture: getCompleteImageUrl(admin.profilePicture),
                admin: {
                    id: admin.id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    roleId: admin.roleId,
                    role: admin.roleDetails,
                    profilePicture: getCompleteImageUrl(admin.profilePicture)
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
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] },
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] }
                }
            }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const adminData = admin.toJSON ? admin.toJSON() : admin;

        // Add complete image URL for profile picture
        if (adminData.profilePicture) {
            adminData.profilePicture = getCompleteImageUrl(adminData.profilePicture);
        }

        res.json({
            success: true,
            data: adminData
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
            firstName: firstName || admin.firstName,
            lastName: lastName || admin.lastName
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                id: admin.id,
                email: admin.email
            }
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

        try {
            await sendEmail(
                admin.email,
                'passwordReset',
                {
                    name: admin.firstName || 'Admin',
                    resetCode: resetCode
                }
            );
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            return res.json({
                success: true,
                message: 'Password reset email sent',
                _note: 'Email sending failed, but code was generated'
            });
        }

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

        try {
            await sendEmail(
                admin.email,
                'passwordReset',
                {
                    name: admin.firstName || 'Admin',
                    resetCode: resetCode
                }
            );
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            return res.json({
                success: true,
                message: 'Password reset email sent',
                _note: 'Email sending failed, but code was generated'
            });
        }

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
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires'] },
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] }
                }
            }
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
        const { firstName, lastName, roleId, isActive } = req.body;

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
            roleId,
            isActive
        });

        // Fetch updated admin with role details
        const updatedAdmin = await Admin.findByPk(id, {
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] }
                }
            }
        });

        res.json({
            success: true,
            message: 'Admin updated successfully',
            data: updatedAdmin
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
        const currentAdminId = req.user.id; // Get current admin (the one performing deletion)

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Log activity for the admin performing the deletion
        await logActivity(currentAdminId, 'DELETE_ADMIN', {
            entityType: 'Admin',
            entityId: id,
            details: {
                deletedAdminEmail: admin.email,
                deletedAdminName: `${admin.firstName} ${admin.lastName}`,
                timestamp: new Date()
            },
            status: 'success'
        });

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

/**
 * Update admin profile picture
 */
exports.changeProfilePicture = async (req, res) => {
    try {
        const { id } = req.user; // Get admin id from authenticated user

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Store relative path to the uploaded file
        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;

        await admin.update({
            profilePicture: profilePictureUrl
        });

        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            data: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                roleId: admin.roleId,
                profilePicture: getCompleteImageUrl(profilePictureUrl)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error: error.message
        });
    }
};

/**
 * Change admin password
 */
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.user; // Get admin id from authenticated user
        const { oldPassword, newPassword } = req.body;

        // Validate required fields
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required'
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Verify old password
        const isPasswordValid = await comparePassword(oldPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        // Check if new password is the same as old password
        const isSamePassword = await comparePassword(newPassword, admin.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from old password'
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        await admin.update({
            password: hashedPassword
        });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

/**
 * Get single admin by id (with role and privileges)
 */
exports.getAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires', 'loginToken', 'loginTokenExpires'] },
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] }
                }
            }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const adminData = admin.toJSON ? admin.toJSON() : admin;

        // Add complete image URL for profile picture
        if (adminData.profilePicture) {
            adminData.profilePicture = getCompleteImageUrl(adminData.profilePicture);
        }

        // Format date joined
        const dateJoined = new Date(admin.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        res.json({
            success: true,
            data: {
                ...adminData,
                dateJoined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving admin',
            error: error.message
        });
    }
};

/**
 * Get members page data (roles with admins)
 */
exports.getMembersPageData = async (req, res) => {
    try {
        // Fetch roles (only up to 4 roles) with their associated admins
        const roles = await db.Role.findAll({
            limit: 4,
            include: [{
                model: db.Admin,
                as: 'admins',
                attributes: {
                    exclude: ['password', 'resetPasswordToken', 'resetPasswordTokenExpires', 'loginToken', 'loginTokenExpires']
                }
            }],
            attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
            order: [['isDefault', 'DESC'], ['name', 'ASC']]
        });

        // Format the response
        const rolesWithMembers = roles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            isDefault: role.isDefault,
            isCustom: role.isCustom,
            members: (role.admins || []).map(admin => ({
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                profilePicture: getCompleteImageUrl(admin.profilePicture),
                dateAdded: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US') : 'N/A',
                lastActive: admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString('en-US') : 'Never'
            }))
        }));

        res.json({
            success: true,
            data: rolesWithMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching members page data',
            error: error.message
        });
    }
};

/**
 * Invite a team member to create an admin account
 */
exports.inviteMember = async (req, res) => {
    try {
        const { email, roleId, privilegeIds } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        if (!roleId) {
            return res.status(400).json({
                success: false,
                message: 'Role ID is required'
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

        // Verify role exists
        const role = await db.Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // If role is custom, verify all privileges exist
        if (role.isCustom && privilegeIds && privilegeIds.length > 0) {
            const privileges = await db.Privilege.findAll({
                where: { id: privilegeIds }
            });

            if (privileges.length !== privilegeIds.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more privileges not found'
                });
            }
        }

        // Generate random password (16 characters)
        const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

        // Hash password
        const hashedPassword = await hashPassword(tempPassword);

        // Create admin with generated name from email
        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Admin';
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'User';

        const admin = await Admin.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            roleId,
            isActive: true
        });

        // If custom role with specific privileges, update role privileges
        if (role.isCustom && privilegeIds && privilegeIds.length > 0) {
            // Clear existing privileges for this role
            await db.RolePrivilege.destroy({ where: { roleId } });

            // Add new privileges
            for (const privilegeId of privilegeIds) {
                await db.RolePrivilege.create({
                    roleId,
                    privilegeId
                });
            }
        }

        // Log activity for inviting new member
        await logActivity(req.user.id, 'INVITE_MEMBER', {
            entityType: 'Admin',
            entityId: admin.id,
            details: {
                invitedEmail: email,
                roleName: role.name,
                roleId: roleId
            }
        });

        // Send invitation email with credentials
        try {
            await sendEmail(email, 'adminInvitation', {
                name: firstName,
                email,
                password: tempPassword,
                adminDashboardUrl: process.env.ADMIN_DASHBOARD_URL || 'https://joincarsl.com/admin'
            });
        } catch (emailError) {
            console.error('Error sending invitation email:', emailError);
            // Don't fail the request, but log the error
        }

        // Fetch created admin with role and privileges
        const newAdmin = await Admin.findByPk(admin.id, {
            include: {
                model: db.Role,
                as: 'roleDetails',
                attributes: ['id', 'name', 'description', 'isDefault', 'isCustom'],
                include: {
                    model: db.Privilege,
                    as: 'privileges',
                    attributes: ['id', 'name', 'description', 'category'],
                    through: { attributes: [] }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Team member invited successfully',
            data: {
                id: newAdmin.id,
                email: newAdmin.email,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                roleId: newAdmin.roleId,
                role: newAdmin.roleDetails,
                isActive: newAdmin.isActive
            }
        });
    } catch (error) {
        console.error('Error inviting member:', error);
        res.status(500).json({
            success: false,
            message: 'Error inviting team member',
            error: error.message
        });
    }
};
