
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

//     const authenticateUser = (req, res, next) => {
//       let message = null;
//       // Parse the user's credentials from the Authorization header.
//       const credentials = auth(req);
//     console.log(credentials);
//       // If the user's credentials are available...
//       if (credentials) {
//         // Attempt to retrieve the user from the data store
//         // by their username (i.e. the user's "key"
//         // from the Authorization header).
//         const user = users.find(u => u.emailAddress === credentials.name);
    
//         // If a user was successfully retrieved from the data store...
//         if (user) {
//           // Use the bcryptjs npm package to compare the user's password
//           // (from the Authorization header) to the user's password
//           // that was retrieved from the data store.
//           const authenticated = bcryptjs
//             .compareSync(credentials.pass, user.password);
    
//           // If the passwords match...
//           if (authenticated) {
//             console.log(`Authentication successful for username: ${user.emailAddress}`);
    
//             // Then store the retrieved user object on the request object
//             // so any middleware functions that follow this middleware function
//             // will have access to the user's information.
//             req.currentUser = user;
//           } else {
//             message = `Authentication failure for username: ${user.emailAddress}`;
//           }
//         } else {
//           message = `User not found for username: ${credentials.name}`;
//         }
//       } else {
//         message = 'Auth header not found';
//       }
    
//       // If user authentication failed...
//       if (message) {
//         console.warn(message);
    
//         // Return a response with a 401 Unauthorized HTTP status code.
//         res.status(401).json({ message: 'Access Denied' });
//       } else {
//         // Or if user authentication succeeded...
//         // Call the next() method.
//         next();
//       }
//   };
// //Displays all users ---> Should show currently authenticated user instead
// // router.get('/users', authenticateUser, function(req, res, next) {
// //   User.findAll({order: [["id", "ASC"]]}).then(function(user){
// //   res.json(user);
// //     }).catch(function(err){
// //       res.sendStatus(500);
// //   });
// //   });

// // Route that returns the current authenticated user.
// router.get('/users', authenticateUser, (req, res) => {
//   const user = req.currentUser;

//   res.json({
//     name: user.emailAdrdress,
//     pass: user.password,
//   });
// })

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