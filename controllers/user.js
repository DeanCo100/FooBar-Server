const userService = require ('../services/user');

// Try to create a user, if there is an error I catch it and present on the user's screen the relevant message by the client fucntion.
const createUser = async (req, res) => {
  try {
    res.status(201).json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
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
    const { username, password } = req.body;
    const token = await userService.loginUser(username,password);
    if (token) {
      // If user is found and password matches, send success response
      res.status(201).json(token);
    } else {
      // If user is null, it means incorrect username or password
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  }  catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: 'An error occurred while processing your request.' });
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
//gets the friends list of a user
const getFriendsList = async (req, res) => {
  try {
    const friendsList = await userService.getFriendsList(req.params.id); // Make sure to pass the correct parameter
    if (!friendsList) {
      return res.status(404).json({ error: ['User not found'] });
    }
    res.status(201).json(friendsList);
  } catch (error) {
    res.status(500).json({ error: ['Failed to fetch friends list'] });
  }
};
//adds a new friend request
const newFriendRequest = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const response = await userService.newFriendRequest(req.params.username, token);
    res.json(response);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(404).json({ error: [error.message] });
  }
};
//accepts a friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const response = await userService.acceptFriendRequest(req.params.id, req.params.fid);
    res.json(response);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(404).json({ error: [error.message] });
  }
};
//deletes a friend
const deleteFriend = async (req, res) => {
  try {
    const user = await userService.deleteFriend(req.params.id, req.params.fid);
    if (!user) {
      return res.status(404).json({ error: ['User not found'] });
    }
    res.json(user);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: [error.message] });
  }
};


module.exports = { createUser, loginUser, getUserProfile, getUser, deleteUser,
   updateUser,deleteFriend,acceptFriendRequest,newFriendRequest,getFriendsList }
// We need to give a JWT to the user when he log in.