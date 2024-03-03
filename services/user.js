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


const loginUser = async (username, password) => {
 // Find the user in the database based on the provided username
 const user = await User.findOne({ username });

 // If no user is found or the password doesn't match, throw an error
 if (!user || user.password !== password) {
   throw new Error('Incorrect username or password');
 }
// If the user exists in the database
 return user;
};

// Function to generate a JWT to the user
const generateAndSaveToken = async (user) => {
  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });

  // Save the token to the database
  // Example code assuming User model has a tokens array field
  user.tokens.push(token);
  await user.save();

  return token;
};

module.exports = { createUser, loginUser, generateAndSaveToken }

