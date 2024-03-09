// Import the user service for handling user-related operations
const userService = require ('../services/user');
const User = require ('../models/user');

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
// Controller function to handle sending friend requests
const sendFriendRequest = async (req, res) => {
  const { username, friendUsername } = req.body;

  try {
    console.log("Sender Username:", username);
    console.log("Friend Username:", friendUsername);
    // Find the user who is sending the friend request
    const sender = await User.findOne({ username });

    // Find the user who is receiving the friend request
    const receiver = await User.findOne({ username: friendUsername });


    // console.log("Sender:", sender);
    // console.log("Receiver:", receiver);
    if (!sender || !receiver) {
      return res.status(404).json({ message: "One of the users does not exist" });
    }

    // Add friendId to the received friend requests of the receiver
    receiver.friendRequests.received.push(sender._id);
    await receiver.save();

    // Add friendId to the sent friend requests of the sender
    sender.friendRequests.sent.push(receiver._id);
    await sender.save();

    console.log("Sender's Friend Requests (Sent):", sender.friendRequests.sent);
    console.log("Receiver's Friend Requests (Received):", receiver.friendRequests.received);

    // Return success response
    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send friend request. Please try again." });
  }
};
const getFriendRequests = async (req, res) => {
  const { username } = req.params;
  console.log('Received request for user:', username); // Log the received username
  try {
    const friendRequests = await userService.getFriendRequests(username);
    res.status(200).json(friendRequests);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
};
module.exports = { createUser, loginUser, getUserProfile, deleteUser, 
   updateUser, deleteFriend, acceptFriendRequest, getFriendsList, sendFriendRequest, getFriendRequests
  }
// We need to give a JWT to the user when he log in.

