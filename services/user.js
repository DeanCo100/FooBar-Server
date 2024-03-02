const User = require('../models/user');

// Function to create a user
const createPost = async (username, time, profilePic, text, picture) => {
  const user = new User (
    {username: username, time: time, profilePic: profilePic, text: text, picture: picture}
  );
// Now I need to check if the details are indeed valid (validation), I have the checks in the "local" signup component a(and as well in the login component to login), so I need to move this check to be used by the MVC structure.
  return await post.save();
}
module.exports = { createPost }