const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; // Use your actual secret key

// Middleware to check if the requester is the user or a friend of the user
async function friendsOrHimselfCheck(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token is required');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Extract the username from the decoded token
    const usernameFromToken = decoded.username;

    // Fetch the user by :id and check if usernameFromToken matches the user or is in their friends list
    const user = await User.findById(req.params.id)
      .populate('friends', 'username') // Assuming you store the username in the User model
      .exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isUserHimself = user.username === usernameFromToken;
    const isFriend = user.friends.some(friend => friend.username === usernameFromToken);

    if (!isUserHimself && !isFriend) {
      return res.status(403).send('Access denied: Not the user or a friend');
    }

    next(); // Proceed if the user is themselves or a friend
  } catch (error) {
    console.error('Error verifying token or access:', error);
    res.status(500).send('Invalid or expired token');
  }
}