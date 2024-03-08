const userController = require('../controllers/user');
const isValidToken = require('../middleware/tokenChecker');
const compTokenId = require('../middleware/compTokenId');
const friendsChecker = require('../middleware/friendChecker');
const friendsOrHimselfChecker = require('../middleware/friendsOrHimselfChecker');
const express = require('express');
var router = express.Router();

// If I understood it, so when we POST in the signup page, we will operate the createUser of the controller.
router.route('/').post(userController.createUser);
// router.post('/', userController.createUser)
// A route to get the user's data
router.get('/:username', isValidToken, userController.getUserProfile); // Protect route

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

//routes for getting friends list, new friend request
router.route('/:id/friends')
    .get(friendsOrHimselfChecker,userController.getFriendsList)
    .post(userController.newFriendRequest)

//routes for accepting friend request and deleting friend
router.route('/:id/friends/:fid')
            .patch(compTokenId,userController.acceptFriendRequest)
            .delete(compTokenId,userController.deleteFriend)


module.exports = router;