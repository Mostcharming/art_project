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
      Viewer.hasMany(models.Subscriber, {
        foreignKey: 'viewerId',
        as: 'subscriptions'
      });
      Viewer.hasMany(models.ViewerCarouselWatch, {
        foreignKey: 'viewerId',
        as: 'carouselWatches'
      });
      Viewer.hasMany(models.ViewerCarouselFavorite, {
        foreignKey: 'viewerId',
        as: 'carouselFavorites'
      });
      Viewer.hasMany(models.ViewerCarouselFeedback, {
        foreignKey: 'viewerId',
        as: 'carouselFeedback'
      });
      Viewer.hasMany(models.ViewerSearchHistory, {
        foreignKey: 'viewerId',
        as: 'searchHistories'
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
    appUsageLabel: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Display label for viewer app usage preference'
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
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when email was verified'
    },
    setupCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indicates if profile setup (styles, vibe preference, app usage) is complete'
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned'),
      defaultValue: 'active',
      allowNull: false,
      comment: 'Viewer account status: active, suspended, or banned'
    },
    suspensionStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Start date of suspension'
    },
    suspensionEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'End date of suspension'
    },
    reasonForSuspension: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for viewer account suspension'
    },
    reasonForBan: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for viewer account ban'
    },
    reasonForReactivation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for reactivating viewer account'
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to viewer profile picture'
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Viewer website URL'
    },
    accessibilityPreferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Viewer accessibility preference settings'
    },
    accessibilityPreferencesUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when accessibility preferences were last saved'
    },
    contentPreferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Viewer content preference settings'
    },
    contentPreferencesUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when content preferences were last saved'
    }
  }, {
    sequelize,
    modelName: 'Viewer',
  });
  return Viewer;
};
