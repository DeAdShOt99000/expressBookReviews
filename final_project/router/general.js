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
    const booksAsync = async function(){
        const allBooks = await books
        return res.send(JSON.stringify(allBooks, null, 4))
    }
    booksAsync()
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const booksPromise = new Promise((resolve, reject) => {
            resolve(books)
        })

        booksPromise.then(data => {
            return res.send(JSON.stringify(data[isbn], null, 4))
        })
    } else {
        return res.status(404).send('Book not found.')
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksPromise = new Promise((resolve, reject) => {
        resolve(books)
    })
    
    booksPromise.then(data => {
        const filteredBooks = []
        for (book in data){
            if (data[book].author === author){
                filteredBooks.push(data[book])
            }
        }
        return res.send(JSON.stringify(filteredBooks, null, 4))
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksPromise = new Promise((resolve, reject) => {
        resolve(books)
    })
    
    booksPromise.then(data => {
        const filteredBooks = []
        for (book in data){
            if (data[book].title === title){
                filteredBooks.push(data[book])
            }
        }
        return res.send(JSON.stringify(filteredBooks, null, 4))
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = req.params.isbn;
    if (books[book]) {
        return res.send(JSON.stringify(books[book].reviews, null, 4))
    } else {
        return res.status(404).send('Book not found.')
    }
});

module.exports.general = public_users;
