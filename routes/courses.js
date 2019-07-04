'use strict';

const express = require('express');
const Course = require("../models").Course;

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
    res.render('error')
}
}).catch(function(err){
res.sendStatus(500);
});
});

// Creates a new course
// router.post('/courses', (req, res) => {
//     res.location('/courses/:id');
//   // Get the user from the request body.
//   const user = req.body;
//   // Add the user to the `users` array.
//   users.push(user);
//   // Set the status to 201 Created and end the response.
//   res.status(201).end();
// });

router.post('/courses', function(req, res, next) {
    Course.create(req.body)
    .then(function(course) { 
        res.location('/courses/:id');
        // res.status(201);
    }).catch(function(err){
      if (err.name === "SequelizeValidationError"){
        res.sendStatus(400);
        console.log(err);
      } else {
        throw err;
      }
    })
    .catch(function(err){
      res.sendStatus(500);
      console.log(err);
    });
  });



// Updates details for a specific course
router.put('/courses/:id', function(req, res, next){
    Course.findByPk(req.params.id).then(function(course){
      if (course){
      return courses.update(req.body);
      } else {
        res.sendStatus(404);
      }
    }).then(function(books){
      res.redirect("/");    
    }).catch(function(err){
      if (err.name === "SequelizeValidationError"){
        var course = Course.build(req.body);
        course.id = req.params.id;
        // res.render('update-book', {
        //   books: books, 
        //   title: 'Update book',
        // errors: err.errors
        // })
      } 
      else {
        throw err;
      }
    })
    .catch(function(err){
      res.sendStatus(500);
    });
  });

// Deletes a specific course
router.delete('/courses/:id', function(req, res, next){
    Course.findByPk(req.params.id).then(function(course) {
      return course.destroy();
    }).then(function(){
      res.redirect("/");
    }).catch(function(err){
      res.sendStatus(500);
    });
  });

module.exports = router;