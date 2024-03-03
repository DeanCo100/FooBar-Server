const User = require('../models/user');

// Function to create a user
const createUser = async (username, displayName, password, profilePic) => {
  // Check if the DB if the username is already exists
  const existingUser = await User.findOne({ username });
  // If the username is already exists throw error indicates that.
  if (existingUser) {
    throw new Error('Username already taken. Please select a different username.');
  }

   // Create a new user
   const newUser = new User({
    username,
    displayName,
    password,
    profilePic
  });
  return await newUser.save();

// Here I need to have a check whether the username is already taken (which means he is in the DB already, and if so I need to prompt a message) - Done upstairs

}
module.exports = { createUser }