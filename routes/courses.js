'use strict';

const express = require('express');
const Course = require("../models").Course;
var validator = require('validator');

// Construct a router instance.
const router = express.Router();

//Returns list of courses
router.get('/courses', function(req, res, next) {
Course.findAll({order: [["id", "ASC"]]}).then(function(courses){
res.json(courses);
  }).catch(function(err){
    res.sendStatus(500);
});
});

  //Returns specific course
router.get("/courses/:id", function(req, res, next){
Course.findByPk(req.params.id).then(function(courses){
    if (courses) {
        res.json(courses);
} else {
    res.status(404).json({ message: 'That course is not in our databse' });
}
}).catch(function(err){
    err.status = 500;
    return next(err);
});
});

// Creates a new course
router.post('/courses', function(req, res, next) {
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
router.put('/courses/:id', function(req, res, next){
    Course.findByPk(req.params.id).then(function(course){
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
    }).then(function(course){
      res.status(204).end();
    })
    .catch(function(err){
      err.status = 500;
      return next(err);
    });
  });



  
// Deletes a specific course
router.delete('/courses/:id', function(req, res, next){
    Course.findByPk(req.params.id).then(function(course) {
      return course.destroy();
    }).then(function(){
      res.sendStatus(204);
      res.location("/");
    }).catch(function(err){
     res.sendStatus(500);
    });
  });

module.exports = router;