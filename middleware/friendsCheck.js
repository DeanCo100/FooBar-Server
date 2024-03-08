const mongoose = require('mongoose');

const User = mongoose.model('User'); 

// Middleware to check friendship
async function checkFriendship(req, res, next) {
  const username = req.params.id;
  const friendUserName = req.params.fid;

  try {
    // Find the user by userId and check if friendId is in their friends list
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the friendId is in the user's friends array
    const isFriend = user.friends.some(friend => friend.equals(friendId));

    if (!isFriend) {
      return res.status(403).send('The users are not friends');
    }

    next(); // Proceed to the next function if they are friends
  } catch (error) {
    console.error('Error checking friendship:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = checkFriendship;
