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
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Your first name is required.' }   
      } 
      },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Your last name is required.' }   
      } 
      },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      unique: {args: true, msg: 'Hmm, we seem to already have that email on file.'},
      validate: {
        isEmail: {args: true, msg: 'Oops, that doesn\'t look like a valid email address.'},
        notEmpty: { msg: 'An email is required.' }

      }
  },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'A password is required.' }   
      }
    }
    });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Course, {
      // as: 'course',
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    
    });
  };
  return User;
};
