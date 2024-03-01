const userController = require('../controllers/user');
const express = require('express');
var router = express.Router();

// If I understood it, so when we POST in the login page, we will operate the createUser of the controller.
router.route('/').post(userController.createUser);
module.exports = router;