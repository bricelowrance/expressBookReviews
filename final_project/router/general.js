const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User created successfully" });
});



// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  //Write your code here
  const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        },1000);
        });
    };
  try {
    const books = await getBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({error: "An error occured"});
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const ISBN = req.params.isbn;

    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Directly access the book using the ISBN key
                const book = books[ISBN];
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    try {
        const book = await booksBasedOnIsbn(ISBN);
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredBooks = Object.values(books).filter((b) => b.author === auth);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject(new Error("Books not found"));
                }
            }, 1000);
        });
    };

    try {
        const books = await booksBasedOnAuthor(author);
        res.json(books);
    } catch (err) {
        res.status(400).json({ error: "Books not found" });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    const booksBasedOnTitle = (bookTitle) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredBooks = Object.values(books).filter((b) => b.title === bookTitle);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    try {
        const books = await booksBasedOnTitle(title);
        res.json(books);
    } catch (err) {
        res.status(400).json({ error: "Book not found" });
    }
});


//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Check if the book exists
        const book = books[isbn];
        if (book) {
            // Return the reviews as JSON
            res.json(book.reviews);
        } else {
            // Book not found
            res.status(404).json({ error: "Book not found" });
        }
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});


module.exports.general = public_users;