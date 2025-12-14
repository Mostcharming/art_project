'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewerStyle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associations are handled through the many-to-many relationship in Viewer and Style
    }
  }
  ViewerStyle.init({
    viewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Viewers',
        key: 'id'
      }
    },
    styleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Styles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ViewerStyle',
  });
  return ViewerStyle;
};