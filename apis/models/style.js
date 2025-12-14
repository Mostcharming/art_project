'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Style extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Style.belongsToMany(models.Viewer, {
        through: 'ViewerStyle',
        foreignKey: 'styleId',
        otherKey: 'viewerId',
        as: 'viewers'
      });
    }
  }
  Style.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Style',
  });
  return Style;
};