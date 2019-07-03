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
      validate: {
        notEmpty: {
          msg: "Please enter a a course title."
        }
      }    
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "A course description is required."
        }
      }    
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, 
  {});
  Course.associate = function(models) {
    // associations can be defined here
    Course.belongsTo(models.User, {
      as: 'course',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return Course;
};