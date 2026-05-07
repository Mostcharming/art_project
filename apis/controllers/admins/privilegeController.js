const db = require('../../models');
const Privilege = db.Privilege;

/**
 * Get all privileges grouped by category
 */
exports.getAllPrivileges = async (req, res) => {
    try {
        const privileges = await Privilege.findAll({
            order: [['category', 'ASC'], ['name', 'ASC']]
        });

        // Group privileges by category
        const groupedPrivileges = {};
        privileges.forEach(priv => {
            const category = priv.category || 'other';
            if (!groupedPrivileges[category]) {
                groupedPrivileges[category] = [];
            }
            groupedPrivileges[category].push(priv);
        });

        res.json({
            success: true,
            data: privileges,
            grouped: groupedPrivileges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching privileges',
            error: error.message
        });
    }
};

/**
 * Get a single privilege
 */
exports.getPrivilege = async (req, res) => {
    try {
        const { id } = req.params;

        const privilege = await Privilege.findByPk(id);

        if (!privilege) {
            return res.status(404).json({
                success: false,
                message: 'Privilege not found'
            });
        }

        res.json({
            success: true,
            data: privilege
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching privilege',
            error: error.message
        });
    }
};

/**
 * Create a new privilege
 */
exports.createPrivilege = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        // Validate required fields
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Privilege name and category are required'
            });
        }

        // Check if privilege already exists
        const existingPrivilege = await Privilege.findOne({ where: { name } });
        if (existingPrivilege) {
            return res.status(409).json({
                success: false,
                message: 'Privilege with this name already exists'
            });
        }

        // Create the privilege
        const privilege = await Privilege.create({
            name,
            description: description || null,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Privilege created successfully',
            data: privilege
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating privilege',
            error: error.message
        });
    }
};

/**
 * Update a privilege
 */
exports.updatePrivilege = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category } = req.body;

        const privilege = await Privilege.findByPk(id);
        if (!privilege) {
            return res.status(404).json({
                success: false,
                message: 'Privilege not found'
            });
        }

        // Check if name is already taken
        if (name && name !== privilege.name) {
            const existingPrivilege = await Privilege.findOne({ where: { name } });
            if (existingPrivilege) {
                return res.status(409).json({
                    success: false,
                    message: 'Privilege with this name already exists'
                });
            }
        }

        // Update privilege
        await privilege.update({
            name: name || privilege.name,
            description: description !== undefined ? description : privilege.description,
            category: category || privilege.category
        });

        res.json({
            success: true,
            message: 'Privilege updated successfully',
            data: privilege
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating privilege',
            error: error.message
        });
    }
};

/**
 * Delete a privilege
 */
exports.deletePrivilege = async (req, res) => {
    try {
        const { id } = req.params;

        const privilege = await Privilege.findByPk(id);
        if (!privilege) {
            return res.status(404).json({
                success: false,
                message: 'Privilege not found'
            });
        }

        // Check if any roles are using this privilege
        const roleCount = await db.RolePrivilege.count({ where: { privilegeId: id } });
        if (roleCount > 0) {
            return res.status(403).json({
                success: false,
                message: `Cannot delete privilege. ${roleCount} role(s) are using this privilege`
            });
        }

        await privilege.destroy();

        res.json({
            success: true,
            message: 'Privilege deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting privilege',
            error: error.message
        });
    }
};

module.exports = exports;
