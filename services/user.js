const User = require('../models/user');
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY;
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


const loginUser = async (username, password) => {
 // Find the user in the database based on the provided username
  // const username = req.body.username;
  // const password = req.body.password;
  const user = await User.findOne({ username });
 //handling the case that indeed the user is found
// if (user && user.password === password) {
//   const token =generatetoken(req,res);
//   res.status(201).json({ token: generatetoken(req,res)});
   
// } else if (!user || user.password !== password) {
//   throw new Error('Incorrect username or password');
// }
if (user && user.password === password) {
  const token = generatetoken(user); // Adjust according to how you generate tokens
  return {
    token:token,
  };
} else {
  // Instead of throwing here, we simply return null or throw a custom error that the controller can catch
  return null;
}
};


// Get single user info by his id
const getUserByUsername = async (username) => {
  // Find the user in the database based on the provided username
  const user = await User.findOne({ username });
  // Handling the case that indeed the user is found
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Delete user with a given id
const deleteUser = async (username) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  await user.deleteOne();
  return user;
};

// Update user with a given id
// REMARK: NOT FINISHED - PROTOTYPE FUNCTION
const updateUser = async (id, displayName, profilePic) => {
  const user = await getUserById(id);
  if (!user) return null;
  user.displayName = displayName;
  user.profilePic = profilePic;
  await user.save();
  return user;
};




// A function to get the user's data:
const getUserProfile = async (username) => {
  return await User.findOne({ username }).select('username displayName profilePic');
}


//  A function to generate a unique token every time a user is logging in
const generatetoken = (req,res) => {
  const data = { username: req.body.username}
  const token = jwt.sign(data, SECRET_KEY,{ expiresIn:process.env.TOKEN_EXPIRATION })
  return token;
 
};
const getFriendsList = async (username) => {
  try {
    // Find the user by username and populate the friends list
    const user = await User.findOne({ username })
      .populate('friends', 'username displayName profilePic') // Adjust according to your needs
      .exec();

    if (!user) {
      return null; // User not found
    }

    // Map the populated friends to the desired structure
    const friendsList = user.friends.map(friend => ({
      username: friend.username,
      displayName: friend.displayName,
      profilePic: friend.profilePic,
      // Include any other friend details you need
    }));

    return friendsList;
  } catch (error) {
    console.error('Error fetching friends list:', error);
    throw new Error('Failed to retrieve friends list');
  }
};

const newFriendRequest = async (username,token) => {
  try {
    // Step 1: Decode the token to extract the sender's username
    const decoded = jwt.verify(token, SECRET_KEY);
    const senderUsername = decoded.username; // Assuming the username is stored in the token payload

    if (!senderUsername) {
      throw new Error('Sender username not found in token');
    }

    // Step 2: Find the sender and receiver in the database
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    // Step 3: Update the sender's `friendRequests.sent`
    if (!sender.friendRequests.sent.includes(receiver._id)) {
      sender.friendRequests.sent.push(receiver._id);
      await sender.save();
    }

    // Step 4: Update the receiver's `friendRequests.received`
    if (!receiver.friendRequests.received.includes(sender._id)) {
      receiver.friendRequests.received.push(sender._id);
      await receiver.save();
    }
    // Return some confirmation/message or updated document(s)
    return { message: 'Friend request sent successfully.' };
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw new Error('Failed to send friend request');
  }
};



const acceptFriendRequest = async (username,friendsUsername) => {
  try {
    // Find both users
    const user = await User.findOne({ username: username });
    const friend = await User.findOne({ username: friendsUsername });

    if (!user || !friend) {
      throw new Error('One or both users not found');
    }

    // Verify the friend request exists
    const requestExists = user.friendRequests.received.some(request => request.equals(friend._id));
    if (!requestExists) {
      throw new Error('Friend request does not exist');
    }

    // Remove the friend request from user's received and friend's sent
    user.friendRequests.received.pull(friend._id);
    friend.friendRequests.sent.pull(user._id);

    // Add each other to friends list if not already friends
    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
    }
    if (!friend.friends.includes(user._id)) {
      friend.friends.push(user._id);
    }

    // Save changes
    await user.save();
    await friend.save();

    return { message: `${friendsUsername} has been added to your friends list.` };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw new Error('Failed to accept friend request');
  }
};

const deleteFriend = async (username,friendUsername) => {
  try {
    // Find both users
    const user = await User.findOne({ username: username }).populate('friends');
    const friend = await User.findOne({ username: friendUsername }).populate('friends');

    if (!user || !friend) {
      throw new Error('User or friend not found');
    }

    // Check if they are indeed friends
    const userIsFriend = user.friends.some(f => f.username === friendUsername);
    const friendIsUserFriend = friend.friends.some(f => f.username === username);

    if (!userIsFriend || !friendIsUserFriend) {
      throw new Error('Not friends');
    }

    // Remove friend from user's friends list
    user.friends.pull(friend._id);
    // Remove user from friend's friends list
    friend.friends.pull(user._id);

    // Save the updated users
    await user.save();
    await friend.save();

    return { message: `${friendUsername} has been removed from your friends list.` };
  } catch (error) {
    console.error('Error deleting friend:', error);
    throw new Error('Failed to delete friend');
  }
};




module.exports = { createUser, loginUser, getUserProfile,
   getUserByUsername, deleteUser, updateUser, getFriendsList,
    newFriendRequest, acceptFriendRequest, deleteFriend, generatetoken }; 

