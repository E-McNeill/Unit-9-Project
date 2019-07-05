'use strict';

const express = require('express');
const Course = require("../models").Course;
const User = require("../models").User;
var validator = require('validator');
const authenticateUser = require('./authenticateUser');

// Construct a router instance.
const router = express.Router();

//Returns list of courses
// router.get('/courses', function(req, res, next) {
// Course.findAll({
// // order: [["id", "ASC"]], 
// // atttributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
// atttributes: {exclude: ['courses.userId']},

// // include: [{model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]
// })
// .then(function(courses){
// if (courses){
// res.json({courses:courses});
// } else {
//     res.sendStatus(500);
// }
// })
// //   })
// //   .catch(function(err){
// //     res.sendStatus(500);
// });
// // });

//Returns list of courses
router.get('/courses', function(req, res, next) {
    Course.findAll({
        order: [["id", "ASC"]],
    attributes: {exclude: ['createdAt', 'updatedAt']},
    include: [{model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress']}] 
}).then(function(courses){
    res.json(courses);
      }).catch(function(err){
        res.sendStatus(500);
    });
    });

  //Returns specific course
router.get("/courses/:id",  (req, res, next)=> {
    Course.findOne({
        where: {id:req.params.id},
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]})
        .then(function(course){
        if (course) {
            res.json({course:course});
    } else {
        res.status(404).json({ message: 'That course is not in our databse' });
    }
    }).catch(function(err){
        err.status = 500;
        return next(err);
    });
    });
    

// Creates a new course
router.post('/courses', authenticateUser, (req, res, next) => {
    Course.create(req.body)
    .then(function(course) { 
        res.location('/courses/:id');
        res.status(201).end();
    }).catch(function(err){
        if (err.name === "SequelizeValidationError" || "SequelizeUniqueConstraintError"){
            err.status = 400;
            return next(err);
          } else {
        throw err;
      }
    })
    .catch(function(err){
        err.status = 500;
        return next(err);
    });
  });


// Updates details for a specific course
router.put('/courses/:id', authenticateUser, (req, res, next)=> {
    Course.findByPk(req.params.id).then(function(course){
    if (course.userId === req.currentUser.id) {
        if (req.body.title && req.body.description){
            console.log(req.body.title);
      return course.update(req.body);
      } else if (!req.body.title && !req.body.description) {
        const err = new Error('Please include a title and description.');
        err.status = 400;
        return next(err);
      } else if (!req.body.title) {
        const err = new Error('Please include a title.');
        err.status = 400;
        return next(err);
        } else {
        const err = new Error('Please include a description.');
        err.status = 400;
        return next(err);
        }
    } else {
        console.log('nope');
        const err = new Error('Sorry, you don\'t own this course.');
        err.status = 403;
        return next(err);
    }
    }).then(function(course){
      res.status(204).end();
    })
    .catch(function(err){
      err.status = 500;
      return next(err);
    });
  });



  
// Deletes a specific course
router.delete('/courses/:id', authenticateUser,(req, res, next) => {
    Course.findByPk(req.params.id).then(function(course) {
        console.log(course.userId);
        console.log(req.currentUser.id);
if (course.userId === req.currentUser.id) {
    res.sendStatus(204);
    return course.destroy();
    }
    else{
        console.log('nope');
        const err = new Error('Sorry, you don\'t own this course.');
        err.status = 403;
        return next(err);

    }
}).then(function(){
    }).catch(function(err){
     err.status = 500;
     return next(err);

    });
      
  });

module.exports = router;