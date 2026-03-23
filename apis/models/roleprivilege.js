'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePrivilege extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here if needed
        }
    }
    RolePrivilege.init({
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'id'
            }
        },
        privilegeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Privileges',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'RolePrivilege',
        tableName: 'RolePrivileges'
    });
    return RolePrivilege;
};
