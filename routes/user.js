// Import necessary modules and middleware
const userController = require('../controllers/user');
const postController = require('../controllers/post');

const isValidToken = require('../middleware/tokenChecker');
const compTokenId = require('../middleware/compTokenId');
const friendsChecker = require('../middleware/friendsCheck');
const friendsOrHimselfChecker = require('../middleware/friendsOrHimselfCheck');
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




//routes for getting friends list, new friend request
router.route('/:id/friends')
    .get(friendsOrHimselfChecker,userController.getFriendsList)
    .post(userController.newFriendRequest)

//routes for accepting friend request and deleting friend
router.route('/:id/friends/:fid')
            .patch(compTokenId,userController.acceptFriendRequest)
            .delete(compTokenId,userController.deleteFriend)
//routes for updatind and deleting a post
router.route('/:id/posts/:pid')
             .patch(isValidToken, postController.updatePost)
             .delete(isValidToken, postController.deletePost)

//routes for creating a post and getting all posts           
router.route('/:id/posts')
             // maybe need to add another middleware method
             //.get(isValidToken,postController.getAllPosts)
             .post(isValidToken,postController.createPost)

module.exports = router;