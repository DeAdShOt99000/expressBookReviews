const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(404).send('Error registering.')
    }

    if (!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully regesterd! Now you can login."});
    } else {
        return res.status(404).json({message: "User already exists."})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn]))
    } else {
        return res.status(404).send('Book not found.')
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredBooks = []
    for (book in books){
        if (books[book].author === author){
            filteredBooks.push(books[book])
        }
    }
    return res.send(JSON.stringify(filteredBooks, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredBooks = []
    for (book in books){
        if (books[book].title === title){
            filteredBooks.push(books[book])
        }
    }
    return res.send(JSON.stringify(filteredBooks, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = req.params.isbn;
    if (books[book]) {
        return res.send(JSON.stringify(books[book].reviews))
    } else {
        return res.status(404).send('Book not found.')
    }
});

module.exports.general = public_users;
