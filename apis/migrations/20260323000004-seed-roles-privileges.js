'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Define all privileges
        const privileges = [
            {
                name: 'view_all_artworks_carousel',
                description: 'View all uploaded artworks and carousel',
                category: 'content',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'review_approve_content',
                description: 'Review and approve pending content',
                category: 'content',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'reject_content',
                description: 'Reject submitted content',
                category: 'content',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'flag_content',
                description: 'Flag content for review',
                category: 'content',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'hide_unhide_content',
                description: 'Hide or unhide content from public view',
                category: 'content',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'view_all_user_accounts',
                description: 'View all user accounts',
                category: 'users',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'view_content_performance',
                description: 'View content performance metrics',
                category: 'analytics',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Insert privileges
        const insertedPrivileges = await queryInterface.bulkInsert('Privileges', privileges, { returning: true });

        // Define default roles
        const roles = [
            {
                name: 'Super Admin',
                description: 'Full access to all features and settings',
                isDefault: true,
                isCustom: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Admin',
                description: 'Administrative access with most permissions',
                isDefault: true,
                isCustom: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Content Manager',
                description: 'Manage content submissions and approvals',
                isDefault: true,
                isCustom: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Insert roles
        const insertedRoles = await queryInterface.bulkInsert('Roles', roles, { returning: true });

        // Get privilege IDs
        const privilegesFromDb = await queryInterface.sequelize.query(
            'SELECT id, name FROM "Privileges"',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const privilegeMap = {};
        privilegesFromDb.forEach(priv => {
            privilegeMap[priv.name] = priv.id;
        });

        // Get role IDs
        const rolesFromDb = await queryInterface.sequelize.query(
            'SELECT id, name FROM "Roles"',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const roleMap = {};
        rolesFromDb.forEach(role => {
            roleMap[role.name] = role.id;
        });

        // All privilege names
        const allPrivilegeNames = [
            'view_all_artworks_carousel',
            'review_approve_content',
            'reject_content',
            'flag_content',
            'hide_unhide_content',
            'view_all_user_accounts',
            'view_content_performance'
        ];

        // Content-related privileges
        const contentPrivileges = [
            'view_all_artworks_carousel',
            'review_approve_content',
            'reject_content',
            'flag_content',
            'hide_unhide_content'
        ];

        // Create role-privilege relationships
        const rolePrivileges = [];

        // Super Admin - all privileges
        allPrivilegeNames.forEach(privName => {
            rolePrivileges.push({
                roleId: roleMap['Super Admin'],
                privilegeId: privilegeMap[privName],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        // Admin - all privileges
        allPrivilegeNames.forEach(privName => {
            rolePrivileges.push({
                roleId: roleMap['Admin'],
                privilegeId: privilegeMap[privName],
                createdAt: new Date(),
                updatedAt: new Date()

            });
        });

        // Content Manager - content-related privileges only
        contentPrivileges.forEach(privName => {
            rolePrivileges.push({
                roleId: roleMap['Content Manager'],
                privilegeId: privilegeMap[privName],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        // Insert role-privilege relationships
        if (rolePrivileges.length > 0) {
            await queryInterface.bulkInsert('RolePrivileges', rolePrivileges);
        }
    },

    async down(queryInterface, Sequelize) {
        // Delete in reverse order to maintain foreign key constraints
        await queryInterface.bulkDelete('RolePrivileges', {});
        await queryInterface.bulkDelete('Roles', {});
        await queryInterface.bulkDelete('Privileges', {});
    }
};
