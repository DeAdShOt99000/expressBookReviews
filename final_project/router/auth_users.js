const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const validUsers = users.filter((user) => {
        return user.username === username
    });
    if (validUsers.length > 0){
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password)=>{ 
    const validUsers = users.filter((user) => {
        return user.username === username && user.password === password
    });
    if (validUsers.length > 0){
        return true
    } else {
        return false
    };
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(404).json({message: 'Error logging in.'});
    }

    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {
        "accessToken": accessToken,
        "username": username
    }
    return res.status(200).send('User successfully logged in.')
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const bookIsbn = req.params.isbn;
    const currentUser = req.session.authorization['username']

    if (books[bookIsbn]){
        const review = req.query.review;
        try {
            books[bookIsbn]['reviews'][currentUser] = review;
        } catch (error) {
            books[bookIsbn]['reviews'] = {...books[bookIsbn]['reviews'], ...{[currentUser]: review}}
        }
        return res.send('Success.')
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookIsbn = req.params.isbn
    const currentUser = req.session.authorization['username']
    if (books[bookIsbn]){
        delete books[bookIsbn]["reviews"][currentUser]
        return res.send('Review was successfully deleted.')
    } else {
        res.status(404).send('Book not found.')
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
