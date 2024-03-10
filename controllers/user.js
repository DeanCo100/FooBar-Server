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
// const acceptFriendRequest = async (req, res) => {
//   try {
//     const response = await userService.acceptFriendRequest(req.params.id, req.params.fid);
//     res.json(response);
//   } catch (error) {
//     console.error('Controller error:', error.message);
//     res.status(404).json({ error: [error.message] });
//   }
// };


// //deletes a friend
// const deleteFriend = async (req, res) => {
//   try {
//     const user = await userService.deleteFriend(req.params.id, req.params.fid);
//     if (!user) {
//       return res.status(404).json({ error: ['User not found'] });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Controller error:', error.message);
//     res.status(500).json({ error: [error.message] });
//   }
// };
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
  console.log('Request params:', req.params); // Log the request parameters
  const { id: username } = req.params; // Rename id to username
  console.log('Received request for user:', username); // Log the received username
  try {
    const friendRequestsDetails = await userService.getFriendRequests(username);
    console.log('FRIEND REQUESTS:');
    console.log(friendRequestsDetails);
    res.status(200).json(friendRequestsDetails);
   } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
};

// Controller function to accept a friend request
const acceptFriendRequest = async (req, res) => {
  const { id, fid } = req.params; // id is the current user's id, fid is the friend's id

  try {
    // Remove friend request from the receiver's received requests
    await userService.removeFriendRequest(id, fid);

    // Add both users to each other's friends list
    await userService.addFriend(id, fid);
    // await userService.addFriend(fid, id);

    // Return the friend's details (you may customize this as needed)
    const friend = await userService.getUserById(fid);
    res.status(200).json(friend);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
};

// Controller function to decline a friend request
// const declineFriendRequest = async (req, res) => {
//   const { id, fid } = req.params; // id is the current user's id, fid is the friend's id

//   try {
//     // Remove friend request from both the receiver's received requests and sender's sent requests
//     await userService.removeFriendRequest(id, fid);
//     // await userService.removeFriendRequest(fid, id);

//     res.status(204).send(); // No content in response
//   } catch (error) {
//     console.error('Controller error:', error.message);
//     res.status(500).json({ error: 'Failed to decline friend request' });
//   }
// };

// Controller function to decline a friend request or remove a friend
const removeFriendOrRequest = async (req, res) => {
  const { id, fid } = req.params; // id is the current user's username, fid is the friend's id

  try {
    // Find the user by username
    const user = await User.findOne({ username: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the friend by ID
    const friend = await User.findById(fid);

    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    if (user.friends.includes(fid) && friend.friends.includes(user._id)) {
      // If users are already friends, remove them from each other's friends list
      await userService.removeFriend(user._id, fid);
      // await userService.removeFriend(fid, user._id);
    } else {
      // If not friends, remove the friend request from each other's lists
      await userService.removeFriendRequest(user.username, fid);
      // await userService.removeFriendRequest(fid, user._id);
    }

    res.status(204).send(); // No content in response
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
};
// Controller function to fetch a user's friends
const getUserFriends = async (req, res) => {
  const { id } = req.params; // id is the username of the user

  try {
    // Call the service function to get the user's friends
    const friends = await userService.getUserFriends(id);
    
    // Return the friends list in the response
    res.status(200).json(friends);
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user friends' });
  }
};


module.exports = { createUser, loginUser, getUserProfile, deleteUser, 
   updateUser, acceptFriendRequest, getFriendsList, sendFriendRequest, getFriendRequests, acceptFriendRequest, removeFriendOrRequest, getUserFriends
  }
// We need to give a JWT to the user when he log in.

