const Post = require('../models/post');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const checkBlacklistedURL = require('../utils/BloomFilterHelper');



const createPost = async (posterUsername ,username, userPic, postText, postImage, postTime) => {
  try {

  if (checkBlacklistedURL(postText)) {
    throw new Error('The post includes a BLACKLISTED url, Please try again');
  }

    // Save the new post
    const newPost = new Post ({ 
      posterUsername,
      username, 
      userPic,
      postText,
      postImage,
      postTime
    });

  const savedPost = await newPost.save();
  // Retrieve the user by his username
  const user = await User.findOne({ username: posterUsername });
  if (!user) {
    throw new Error('User not found');
  }
  // Add the new post to the user's posts array
  user.posts.push(savedPost._id);
  await user.save();
  return savedPost;
  } catch (error) {
    // Throw the error so the controller can catch it.
    throw error;
  }
};

// Function to update post by id
const updatePost = async (pid, newText, newPicture) => {

  try {
    //  Illegal post text
    if (checkBlacklistedURL(newText)) {
      throw new Error('The post includes a BLACKLISTED url, Please try again');
    }
  // Find the post by its ID
  const post = await getPostById(pid);
  if (!post){
    throw new Error('Post not found');
  }
  // Update the post fields
  post.postText = newText;
  post.postImage = newPicture;

  // Save the updated post
  const updatedPost = await post.save();
  // Update the user's posts array
  const user = await User.findOne( { username: post.posterUsername} );
  if (!user) {
    throw new Error('User not found');
  }
  const postIndex = user.posts.findIndex(postId => postId.equals(updatedPost._id));
  if (postIndex !== -1) {
    // Update the post in the user's posts array
    user.posts[postIndex] = updatedPost._id;
    // Save the updated user document
    await user.save();
  }
  return updatePost;
  } catch (error) {
  // Throw the error so the controller can catch it.
    throw error;
  }
};

const getPostById = async (pid) => {
  //const post = await Post.findOne({ _id: pid });
  const post = await Post.findById(pid);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};



// Function to delete post by id
const deletePost = async (pid) => {
  // Find the post by its ID
  const post = await getPostById(pid);
  if (!post) {
    throw new Error('Post not found');
  }
  // Find the user associated with the post
  const user = await User.findOne({ username: post.posterUsername });
  if (!user) {
    throw new Error('User not found');
  }
  // Remove the post from the user's posts array
  user.posts = user.posts.filter(postId => !postId.equals(post._id));
  // Save the updated user document
  await user.save();
  // Delete the post from the posts database
  await post.deleteOne();
  return post;
};

// Function to get posts of a friend
const getFriendPosts = async (token, usernameFriend) => {
  // Decode the token to get the username of the logged-in user
  const decoded = jwt.verify(token, SECRET_KEY);
  const loggedInUsername = decoded.username;
  // Check if the logged-in user and the poster are friends
  const loggedInUser = await User.findOne({ username: loggedInUsername }).populate('friends');
  // const desiredUser = await User.findOne({ username: usernameFriend });
  const desiredUser = await User.findOne({ username: usernameFriend }).populate({ path: 'posts', options: { sort: { postTime: -1 } } }); // Populate the posts field and sort by createdAt in descending order


  if (!loggedInUser) {
     throw new Error('User not found');
  }
  if (loggedInUsername === usernameFriend) {
    // If the logged-in user is viewing their own posts
    return { areFriends: true, friendPosts: desiredUser.posts };
  } else {
    const areFriends = loggedInUser.friends.some(friend => friend.username === usernameFriend);
    if (areFriends) {
      return { areFriends: true, friendPosts: desiredUser.posts };
    } else {
      // If they are not friends, respond with an error message
      return { areFriends: false, friendPosts: [] };
    }
  }
};

// Service function to fetch a maximum of 25 posts, consisting of the newest posts from non-friends and friends of the connected user
const getFeedPosts = async (decodedUsername) => {
  try {
    // Find the connected user and populate the 'friends' field
    const connectedUser = await User.findOne({ username: decodedUsername }).populate('friends');

    if (!connectedUser) {
      throw new Error('Connected user not found');
    }

    // Extract the usernames of the connected user's friends
    const friendUsernames = connectedUser.friends.map(friend => friend.username);

    // Fetch the newest 5 posts from non-friends
    const nonFriendPosts = await Post.find({ posterUsername: { $nin: friendUsernames } })
      .sort({ postTime: -1 })
      .limit(5);

    // Fetch the newest 20 posts from friends
    const friendPosts = await Post.find({ posterUsername: { $in: friendUsernames } })
      .sort({ postTime: -1 })
      .limit(20);
    // Combine the posts from non-friends and friends
    let combinedPosts = [...nonFriendPosts, ...friendPosts];

    // Sort the combined posts by postTime in descending order
    combinedPosts.sort((a, b) => new Date(b.postTime) - new Date(a.postTime));

    // Return a maximum of 25 posts
    combinedPosts = combinedPosts.slice(0, 25);

    return combinedPosts;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch posts');
  }
};
// Function to handle like
const updatePostLikeStatus = async (username, postId, isLiked) => {

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return { success: false, message: 'Post not found.' };
    }
    // Find the user based on the provided username
    let user = await User.findOne({ username });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }
    const userIdString = user._id.toString();

    if (isLiked && !post.likes.includes(userIdString)) {
      post.likes.push(userIdString);
      post.likeCount += 1; // Increment likeCount
    } else if (!isLiked && post.likes.includes(userIdString)) {
      post.likes = post.likes.filter(like => like.toString() !== userIdString);
      post.likeCount -= 1; // Decrement likeCount
    }

    await post.save();
    return { success: true, likeCount: post.likeCount };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error.' };
  }
};
module.exports = { createPost, getPostById ,updatePost, deletePost, getFeedPosts, getFriendPosts, updatePostLikeStatus
}