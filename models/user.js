'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First name is required."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last name is required."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "An email address is required."
        }
      }    
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "A password is required."
        }
      }    
    }
    });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Course, {
      as: 'course',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return User;
};