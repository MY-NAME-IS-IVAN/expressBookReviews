const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.find((user) => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    const user = users
        .find((user) => user.username === username && user.password === password);

    return !!user;
}

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: 'Not valid username or passowrd' })
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign(
            {
                data: password,
            },
            'access',
            {
                expiresIn: 60 * 60,
            }
        );

        req.session.authorization = { accessToken, username };

        return res.status(200).json({ message: 'Successfully signed in' });
    }

    return res.status(208).send("Invalid Login. check username and password");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    books[isbn].reviews[req.session.authorization["username"]] = review;
    return res
        .status(200)
        .json({ message: "review succeed", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    delete books[isbn].reviews[req.session.authorization["username"]];
    return res
        .status(200)
        .json({ message: "review deleted", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
