
'use strict';

const express = require('express');
const users = [];

// Construct a router instance.
const router = express.Router();

router.get('/users', (req, res) => {
    res.json(users);
  });

//   Route that creates a new user.

router.post('/users', (req, res) => {
    res.location('/');
  // Get the user from the request body.
  const user = req.body;

  // Add the user to the `users` array.
  users.push(user);

  // Set the status to 201 Created and end the response.
  res.status(201).end();
});

module.exports = router;