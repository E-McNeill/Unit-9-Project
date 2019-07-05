
'use strict';

const express = require('express');
const User = require("../models").User;
var validator = require('validator');
var bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Construct a router instance.
const router = express.Router();

// Create the Express app.
const app = express();

// Authenticate the user info

const authenticateUser = (req, res, next) => {
  let message = null;
  const credentials = auth(req);

  if (credentials) {
   User.findOne({where: {emailAddress : credentials.name}}).then( user => {
    // console.log(user);
  
  if (user){
    const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

    if (authenticated) {
      console.log(`Authentication successful for username: ${user.emailAddress}`);
      req.currentUser = user;
      // console.log(req.currentUser);
      next();
    } else {
      // message = `Authentication failure for username: ${user.emailAddress}`;
      console.log(`Authentication failure for username: ${user.emailAddress}`);
      const err = new Error(`Authentication failure for username: ${user.emailAddress}`);
      err.status = 401;
      next(err);


    }
    } else {
      // message = `User not found for username: ${credentials.name}`;
      console.log(`User not found for username: ${credentials.name}`);
      const err = new Error(`User not found for username: ${credentials.name}`);
      err.status = 401;
      next(err);
    }
  })
    } 
    else {
      console.log('Auth header not found');
      // res.status(401).json({ message: 'Access Denied' });
      const err = new Error(`Access Denied`);
      err.status = 401;
      next(err);
    }
  }

  // Route that returns the current authenticated user.
  router.get('/users', authenticateUser, (req, res) => {
      const user = req.currentUser;
    
      // res.json({
      //   firstName: User.firstName,
      //   lastName: User.lastName,
      // });
      res.json({
        message: `Currently Authenticated User: ${user.firstName} ${user.lastName}`
      })
    })
  

//   Route that creates a new user.
router.post('/users', function(req, res, next) {
  // Hash the new user's password.
  req.body.password = bcryptjs.hashSync(req.body.password);
  // const user = req.body;
User.create(req.body)
.then(function(user) { 
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