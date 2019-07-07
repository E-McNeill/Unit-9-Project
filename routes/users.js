
'use strict';

const express = require('express');
const User = require("../models").User;
var validator = require('validator');
var bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const authenticateUser = require('./authenticateUser');

// Construct a router instance.
const router = express.Router();

// Create the Express app.
const app = express();

  // Returns the current authenticated user.
  router.get('/users', authenticateUser, (req, res) => {
      const user = req.currentUser;
    
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
      });
    })
  

//   Creates a new user.
router.post('/users', function(req, res, next) {
  // Hash the new user's password.
  req.body.password = bcryptjs.hashSync(req.body.password);

  User.create(req.body)
  .then(function(user) { 
    // req.body.password = bcryptjs.hashSync(req.body.password);
      res.location('/');
      res.status(201).end();
  })
  .catch(function(err){
    if (err.name === "SequelizeValidationError" || "SequelizeUniqueConstraintError"){
      err.status = 400;
      return next(err);
    } else {
      throw err;
    }
    }).catch(function(err){
      err.status = 500;
      return next(err);
  });
});


module.exports = router;