const userController = require('../controllers/user');
const postController = require('../controllers/post');

const isValidToken = require('../middleware/tokenChecker');
const express = require('express');

var router = express.Router();
// Route to get the necessary posts to display on Feed
router.route('/').get(isValidToken, postController.getFeedPosts);


module.exports = router;