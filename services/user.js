const User = require('../models/user');

// Function to create a user
const createUser = async (username, displayName, password, profilePic) => {
  const post = new User (
    {username: username, displayName: displayName, password: password, profilePic: profilePic}
  );
// Now I need to check if the details are indeed valid (validation), I have the checks in the "local" signup component a(and as well in the login component to login), so I need to move this check to be used by the MVC structure.
  return await user.save();
}
module.exports = { createUser }