const userController = require('../controllers/user');
const postController = require('../controllers/post');

const isValidToken = require('../middleware/tokenChecker');
const compTokenId = require('../middleware/compTokenId');
const friendsChecker = require('../middleware/friendsCheck');
const friendsOrHimselfChecker = require('../middleware/friendsOrHimselfCheck');
const express = require('express');

var router = express.Router();

// If I understood it, so when we POST in the login page, we will operate the createUser of the controller.
//router.route('/').post(postController.createPost);
router.route('/').get(isValidToken, postController.getAllPosts);

module.exports = router;