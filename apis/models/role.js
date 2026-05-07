'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Many-to-Many relationship with Privilege
            Role.belongsToMany(models.Privilege, {
                through: 'RolePrivileges',
                foreignKey: 'roleId',
                otherKey: 'privilegeId',
                as: 'privileges'
            });

            // One-to-Many relationship with Admin
            Role.hasMany(models.Admin, {
                foreignKey: 'roleId',
                as: 'admins'
            });
        }
    }
    Role.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Name of the role (e.g., Super Admin, Admin, Content Manager)'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of what this role can do'
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether this is a default system role'
        },
        isCustom: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether this is a custom role created by admin'
        }
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};
