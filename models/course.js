'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Please enter a title.' }   
      } 
      },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Please enter a description.' }   
      } 
      },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, 
  {});
  Course.associate = function(models) {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        defaultValue: '',
        validate: {
          notEmpty: { msg: 'A userId is required.' },
        }
      },
    });
  };
  return Course;
};