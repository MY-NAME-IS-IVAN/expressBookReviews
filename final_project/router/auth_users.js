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

    if (user) {
        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: 60 * 60 })
    } else {
        res.status(401).json({ message: "Invalid username or password" })
    }
}

regd_users.post("/login", (req, res) => {
    
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
