'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Privilege extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Many-to-Many relationship with Role
            Privilege.belongsToMany(models.Role, {
                through: 'RolePrivileges',
                foreignKey: 'privilegeId',
                otherKey: 'roleId',
                as: 'roles'
            });
        }
    }
    Privilege.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Name of the privilege (e.g., view_artworks, approve_content)'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of this privilege'
        },
        category: {
            type: DataTypes.ENUM('content', 'users', 'analytics', 'system'),
            comment: 'Category of privilege for grouping'
        }
    }, {
        sequelize,
        modelName: 'Privilege',
    });
    return Privilege;
};
