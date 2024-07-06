const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const doesExist = (username) => {
  const user = users.filter((user) => user.username === username);
  return user.length > 0 ? true : false;
};

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: 'User successfully registered! Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }

  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookDetails = [];
  for (let key in books) {
    if (books[key].author === author) bookDetails.push(books[key]);
  }

  return res.send(bookDetails);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  for (let key in books) {
    if (books[key].title === title) return res.send(books[key]);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
