'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viewer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Viewer.belongsToMany(models.Style, {
        through: 'ViewerStyle',
        foreignKey: 'viewerId',
        otherKey: 'styleId',
        as: 'styles'
      });
      Viewer.hasMany(models.Favorite, {
        foreignKey: 'viewerId',
        as: 'favorites'
      });
    }
  }
  Viewer.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vibePreference: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      },
      comment: '0 = calm, 100 = vibrant'
    },
    appUsage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'How they want to use the app (e.g., "discovery", "curation", "portfolio")'
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Viewer',
  });
  return Viewer;
};