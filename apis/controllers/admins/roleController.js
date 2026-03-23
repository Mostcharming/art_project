const db = require('../../models');
const Role = db.Role;
const Privilege = db.Privilege;

/**
 * Get all roles with their privileges
 */
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: [{
                model: db.Privilege,
                as: 'privileges',
                through: { attributes: [] }
            }],
            order: [['isDefault', 'DESC'], ['name', 'ASC']]
        });

        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching roles',
            error: error.message
        });
    }
};

/**
 * Get a single role with privileges
 */
exports.getRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id, {
            include: [{
                model: db.Privilege,
                as: 'privileges',
                through: { attributes: [] }
            }]
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching role',
            error: error.message
        });
    }
};

/**
 * Create a custom role
 */
exports.createRole = async (req, res) => {
    try {
        const { name, description, privilegeIds } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required'
            });
        }

        // Check if role already exists
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return res.status(409).json({
                success: false,
                message: 'Role with this name already exists'
            });
        }

        // Create the role
        const role = await Role.create({
            name,
            description: description || null,
            isCustom: true,
            isDefault: false
        });

        // Add privileges to the role if provided
        if (Array.isArray(privilegeIds) && privilegeIds.length > 0) {
            await role.addPrivileges(privilegeIds);
        }

        // Fetch the role with privileges
        const roleWithPrivileges = await Role.findByPk(role.id, {
            include: [{
                model: db.Privilege,
                as: 'privileges',
                through: { attributes: [] }
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: roleWithPrivileges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating role',
            error: error.message
        });
    }
};

/**
 * Update a custom role
 */
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, privilegeIds } = req.body;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Don't allow updating default roles
        if (role.isDefault) {
            return res.status(403).json({
                success: false,
                message: 'Cannot modify default roles'
            });
        }

        // Check if name is already taken
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({ where: { name } });
            if (existingRole) {
                return res.status(409).json({
                    success: false,
                    message: 'Role with this name already exists'
                });
            }
        }

        // Update role
        await role.update({
            name: name || role.name,
            description: description !== undefined ? description : role.description
        });

        // Update privileges if provided
        if (Array.isArray(privilegeIds)) {
            await role.setPrivileges(privilegeIds);
        }

        // Fetch updated role with privileges
        const updatedRole = await Role.findByPk(id, {
            include: [{
                model: db.Privilege,
                as: 'privileges',
                through: { attributes: [] }
            }]
        });

        res.json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating role',
            error: error.message
        });
    }
};

/**
 * Delete a custom role
 */
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Don't allow deleting default roles
        if (role.isDefault) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete default roles'
            });
        }

        // Check if any admins are using this role
        const adminCount = await db.Admin.count({ where: { roleId: id } });
        if (adminCount > 0) {
            return res.status(403).json({
                success: false,
                message: `Cannot delete role. ${adminCount} admin(s) are assigned to this role`
            });
        }

        await role.destroy();

        res.json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting role',
            error: error.message
        });
    }
};

module.exports = exports;
