// Import necessary modules and dependencies
const User = require('../models/user');
const jwt = require("jsonwebtoken")

// Function to create a user
const createUser = async (username, displayName, password, profilePic) => {
  // Check if the DB if the username is already exists
  const existingUser = await User.findOne({ username });
  // If the username is already exists throw error indicates that.
  if (existingUser) {
    throw new Error('Username already taken. Please select a different username');
  }
   // Create a new user
   const newUser = new User({
    username,
    displayName,
    password,
    profilePic
  });
  return await newUser.save();
}

// Function to handle user login
const loginUser = async (req, res) => {
 // Find the user in the database based on the provided username
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username });
 //handling the case that indeed the user is found
if (user && user.password === password) {
    res.status(201).json({ token: generatetoken(req,res)});
} else if (!user || user.password !== password) {
  throw new Error('Incorrect username or password');
}
};


// Function to get a single user's information by username
const getUserByUsername = async (username) => {
  // Find the user in the database based on the provided username
  const user = await User.findOne({ username });
  // Handling the case that indeed the user is found
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Function to delete a user by username
const deleteUser = async (username) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  await user.deleteOne();
  return user;
};

// Function to update user information by username
const updateUser = async (username, displayName, profilePic) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  user.displayName = displayName;
  user.profilePic = profilePic;
  return await user.save();
};

// Function to get a user's profile by username
const getUserProfile = async (username) => {
  return await User.findOne({ username }).select('username displayName profilePic');
}

//  A function to generate a unique token every time a user is logging in
const generatetoken = (req,res) => {
  const data = { username: req.body.username}
  const key = process.env.SECRET_KEY;
  const token = jwt.sign(data, key,{ expiresIn:process.env.TOKEN_EXPIRATION })
  return token;
 
};

// Export all functions for use in controllers
module.exports = { createUser, loginUser, getUserProfile, getUserByUsername, deleteUser, updateUser }

