const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a valid username and password' });
    }

    const userExists = users.find((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    users.push({ username, password })
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    res.send(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksList = Object.values(books);
    const filteredBooks = booksList.filter((book) => book.author === author);

    if (filteredBooks && filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks));
    } else {
        res.send(`Book not found for ${author}`)
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksList = Object.values(books);
    const filteredBooks = booksList.filter((book) => book.title === title);

    if (filteredBooks && filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks));
    } else {
        res.send(`No books named ${title} were found`);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const reviews = books[req.params.isbn].reviews;
    res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;