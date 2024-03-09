const Post = require('../models/post');
const User = require('../models/user');

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

const getFeedPosts = async () => {
  return;
}

module.exports = { createPost, getPostById ,updatePost, deletePost, getFeedPosts }