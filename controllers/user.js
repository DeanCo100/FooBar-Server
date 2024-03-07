const userService = require ('../services/user');

// Try to create a user, if there is an error I catch it and present on the user's screen the relevant message by the client fucntion.
const createUser = async (req, res) => {
  try {
    res.json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
  } catch (error) {
    res.status(401).json({error: 'Username already taken. Please select a different username'})
  }
}
// Try to login the user, if there is an error I catch it and present on the user's screen the relevant message by the client function.
// const loginUser = async (req, res) => {
//   try {
//     const user = await userService.loginUser(req.body.username, req.body.password);
//     res.json(user);
//   } catch (error) {
//     res.status(401).json({ error: 'Incorrect username or password' });
//   }
// };
const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req,res);
  } catch (error) {
    res.status(401).json({ error: 'Incorrect username or password' });
  }
};
// Function to handle the request to user data
const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
      const userProfile = await userService.getUserProfile(username);
      res.status(200).json(userProfile);
  } catch (error) {
      res.status(404).json({ error: 'User profile not found' });
  }
}

// Method to get user info by his id
// REMARK: Need to add try-catch for edge cases 
const getUser = async (req, res) => { 
  try {
    const user = await userService.getUserByUsername(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: ['User not found']})
  }
};


// REMARK: Need to add try-catch for edge cases 
const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: ['User not found'] })
  }
};


// REMARK: Need to add try-catch for edge cases 
const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body.displayName, req.body.profilePic);
  if (!user) {
    return res.status(404).json( { error: ['User not found'] });
  }
  res.json(user);
};



module.exports = { createUser, loginUser, getUserProfile, getUser, deleteUser, updateUser }
// We need to give a JWT to the user when he log in.