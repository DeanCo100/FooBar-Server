const userController = require('../controllers/user');
const express = require('express');
var router = express.Router();

// If I understood it, so when we POST in the signup page, we will operate the createUser of the controller.
router.route('/').post(userController.loginUser);
module.exports = router;