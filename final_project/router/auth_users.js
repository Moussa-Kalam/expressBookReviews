const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.filter((user) => user.username === username);
  return user.length > 0 ? true : false;
};

const authenticatedUser = (username, password) => {
  // Filter the user with the same username and password
  const validUser = users.filter(
    (user) => user.username === username && user.password === password
  );

  return validUser.length > 0 ? true : false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check the user credentials
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  // Authenticate the userSelect
  if (authenticatedUser(username, password)) {
    // Generate JWT Token
    const accessToken = jwt.sign({ data: password }, 'access', {
      expiresIn: 60 * 60,
    });

    // Store access token and username in session
    req.session.authorization = { accessToken, username };

    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check your credentials' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  // Get the username from the session
  const username = req.session.authorization.username;

  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username | !isbn | !review) {
    return res.status(400).json({
      message: 'Invalid request. Please provide username, ISBN, and review.',
    });
  }

  // Check if the user is valid
  if (!isValid(username))
    return res.status(401).json({ message: 'Unauthorized user' });

  // Check if the book exists
  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });

  books[isbn].reviews[username] = review;

  return res
    .status(200)
    .json({ message: 'Review added/updated successfully!' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  // Get the username from the session
  const username = req.session.authorization.username;

  const isbn = req.params.isbn;

  if (!isbn || !username) {
    return res
      .status(400)
      .json({ message: 'Invalid request. Please provide useername and ISBN' });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found!' });
  }

  delete books[isbn].reviews[username];

  return res.status(204).json({
    message: 'Review deleted successfully',
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
