// Import the user service for handling user-related operations
const userService = require ('../services/user');

// Function to create a new user
const createUser = async (req, res) => {
  try {
    // Attempt to create a user and respond with the result
    res.json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
  } catch (error) {
    // If an error occurs (e.g., username already taken), respond with an error message
    res.status(401).json({error: 'Username already taken. Please select a different username'})
  }
}

// Function to handle user login
const loginUser = async (req, res) => {
  try {
    // Attempt to log in the user and respond with the result
    const user = await userService.loginUser(req,res);
  } catch (error) {
    // If an error occurs (e.g., incorrect username or password), respond with an error message
    res.status(401).json({ error: 'Incorrect username or password' });
  }
};

// Function to handle the request to user data
const getUserProfile = async (req, res) => {
  try {
      // Attempt to retrieve user profile data and respond with the result
      const userProfile = await userService.getUserProfile(req.params.id);
      res.status(200).json(userProfile);
  } catch (error) {
      // If an error occurs (e.g., user profile not found), respond with an error message
      res.status(404).json({ error: 'User profile not found' });
  }
}

// Function to delete a user
const deleteUser = async (req, res) => {
  try {
    // Attempt to delete a user and respond with the result
    const user = await userService.deleteUser(req.params.id);
    res.json(user);
  } catch (error) {
    // If an error occurs (e.g., user not found), respond with an error message
    res.status(404).json({ error: ['User not found'] });
  }
};

// Function to update user profile
const updateUser = async (req, res) => {
  try {
    // Attempt to update user profile and respond with the result
    const user = await userService.updateUser(req.params.id, req.body.displayName,
       req.body.profilePic);
    res.json(user);
  } catch (error) {
    // If an error occurs (e.g., user not found), respond with an error message
    res.status(404).json({ error: ['User not found'] });
  }
};

// Export all controller functions for use in routes
module.exports = { createUser, loginUser, getUserProfile, deleteUser, updateUser }
