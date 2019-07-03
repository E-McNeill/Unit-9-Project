
// 'use strict';

const express = require('express');
const User = require("../models").User;

// Construct a router instance.
const router = express.Router();
users = [];
//Displays all users ---> Should show currently authenticated user instead
  router.get('/users', function(req, res, next) {
    User.findAll({order: [["id", "ASC"]]}).then(function(users){
    res.json(users);
      }).catch(function(err){
        res.sendStatus(500);
    });
    });
  

//   Route that creates a new user.

// router.post('/users', (req, res) => {
//     res.location('/');
//   // Get the user from the request body.
//   const user = req.body;

//   // Add the user to the `users` array.
//   users.push(user);
//   // Set the status to 201 Created and end the response.
//   res.status(201).end();
// });

router.post('/users', function(req, res, next) {
    User.create(req.body).then(function(user) { 
        res.location('/');
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

module.exports = router;