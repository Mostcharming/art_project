const db = require('../../models');
const Admin = db.Admin;
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/tokenGenerator');

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
 * Login admin
 */
exports.loginAdmin = async (req, res) => {
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

    // Update last login
    await admin.update({ lastLoginAt: new Date() });

    // Generate token
    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
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

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin with this email not found'
      });
    }

    // Generate reset token
    const resetToken = generateToken({ id: admin.id }, '1h');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await admin.update({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpires
    });

    // TODO: Send email with reset token

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error requesting password reset',
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
        message: 'Token and new password are required'
      });
    }

    const admin = await Admin.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpires: { [db.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
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
