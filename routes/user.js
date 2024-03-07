const userController = require('../controllers/user');
const isValidToken = require('../middleware/tokenChecker');
const express = require('express');
var router = express.Router();

// If I understood it, so when we POST in the signup page, we will operate the createUser of the controller.
router.route('/').post(userController.createUser);
// A route to get the user's data
router.get('/:username', isValidToken, userController.getUserProfile); // Protect route

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;