const Post = require('../models/post');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;


const createPost = async (posterUsername ,username, userPic, postText, postImage, postTime) => {
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
};

const getPostById = async (pid) => {
  //const post = await Post.findOne({ _id: pid });
  const post = await Post.findById(pid);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

// Function to update post by id
const updatePost = async (pid, newText, newPicture) => {
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
  const areFriends = loggedInUser.friends.some(friend => friend.username === usernameFriend);
  if (areFriends) {
      return { areFriends: true, friendPosts: desiredUser.posts};
  } else {
      // If they are not friends, respond with an error message
      return { areFriends: false, friendPosts: [] };
    }
  };

// Service function to fetch all posts in descending order by creation date
const getAllPosts = async () => {
  // Fetch all posts from the database, sorted by creation date in descending order
  const posts = await Post.find().sort({ postTime: -1 });
  if (!posts) {
    throw new Error('There are no posts yet');
  }
  return posts;
};


module.exports = { createPost, getPostById ,updatePost, deletePost, getAllPosts, getFriendPosts}