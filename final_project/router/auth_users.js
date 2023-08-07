const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid, authenticatedUser } = require("./auth_users.js");
const books = require("./booksdb.js").books;

const regd_users = express.Router();

regd_users.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Test user credentials
const testUser = {
    username: "testuser",
    password: "testpassword"
};

// Login as a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate the user credentials
    if (username === testUser.username && password === testUser.password) {
        // Generate an access token using JWT
        const accessToken = jwt.sign({ username: username }, "secret-key");

        // Save the access token in the session
        req.session.authorization = {
            accessToken: accessToken
        };

        return res.status(200).json({ message: "User logged in successfully", accessToken: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const { username } = req.session.authorization;

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    // Check if the user has already reviewed the book
    const existingReview = books.findReviewByISBNAndUsername(isbn, username);

    if (existingReview) {
        // Modify the existing review
        existingReview.review = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // Add a new review
        const newReview = {
            isbn: isbn,
            username: username,
            review: review
        };
        books.addReview(newReview);
        return res.status(200).json({ message: "Review added successfully" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    try {
        // Find the review by ISBN and username
        const review = books.findReviewByISBNAndUsername(isbn, username);

        // Find the book by ISBN
        const book = books[isbn];

        // Check if the book exists
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user has a review for the book
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Remove the review from the book's reviews array
        book.reviews = book.reviews.filter((r) => r !== review);

        // Send a success response
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports.authenticated = regd_users;
