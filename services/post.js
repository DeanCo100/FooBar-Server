const Post = require('../models/post');

// Function to create a user
const createPost = async (username, displayName, password, profilePic) => {
  const user = new User (
    {username: username, displayName: displayName, password: password, profilePic: profilePic}
  );

  return await user.save();
}
module.exports = { createUser }