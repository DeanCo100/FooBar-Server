// Import necessary modules and middleware
const userController = require('../controllers/user');
const isValidToken = require('../middleware/tokenChecker');
const express = require('express');

// Create a router instance
var router = express.Router();

// Define routes for user-related operations

// Route for creating a new user (POST request)
router.route('/').post(userController.createUser);

// Route for getting a user's profile by ID (GET request)
// Requires a valid token for authentication
router.get('/:id', isValidToken, userController.getUserProfile);

// Route for updating a user's profile by ID (PATCH request)
// Requires a valid token for authentication
router.patch('/:id', isValidToken, userController.updateUser);

// Route for deleting a user by ID (DELETE request)
// Requires a valid token for authentication
router.delete('/:id', isValidToken, userController.deleteUser);

// Export the router for use in the application
module.exports = router;