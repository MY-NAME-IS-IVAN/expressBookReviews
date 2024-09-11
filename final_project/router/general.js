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
public_users.get('/', async function (req, res) {
    const promise = new Promise((resolve, reject) => {
        resolve(books);
    });

    promise.then((result) => {
        return res.status(200).json({ books: result });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const promise = new Promise((resolve, reject) => {
        resolve(books[req.params.isbn]);
    });

    const book = await promise;

    if (book) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
    const promise = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(
            (b) => b.author === authorName
        );
        resolve(filteredBooks);
    });

    const filteredBooks = await promise;

    if (filteredBooks.length > 0) {
        return res.status(200).json({ books: filteredBooks });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    const promise = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(
            (b) => b.title === title
        );
        return resolve(filteredBooks);
    });

    const filteredBooks = await promise;

    if (filteredBooks.length > 0) {
        return res.status(200).json({ books: filteredBooks });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    const reviews = books[req.params.isbn].reviews;
    res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;