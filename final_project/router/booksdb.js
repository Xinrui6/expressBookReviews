let books = {
      1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
      2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
      3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
      4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
      5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
      6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
      7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
      8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
      9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
      10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

// Function to add a book review
const addReview = (review) => {
const { isbn, username, review: userReview } = review;
const book = books[isbn];
  
if (!book) {
      throw new Error("Book not found");
}
  book.reviews.push({ username, review: userReview });
};
  
// Function to find a book review by ISBN and username
const findReviewByISBNAndUsername = (isbn, username) => {
const book = books[isbn];
if (!book) {
      throw new Error("Book not found");
}
return book.reviews.find((review) => review.username === username);
};
  
// Export the books object and functions
module.exports.books = books;
module.exports.addReview = addReview;
module.exports.findReviewByISBNAndUsername = findReviewByISBNAndUsername;
