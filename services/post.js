const Post = require('../models/post');

const createPost = async (posterUsername ,username, userPic, postText, postImage, postTime) => {
    const newPost = new Post ({ 
      posterUsername,
      username, 
      userPic,
      postText,
      postImage,
      postTime
    });
  return await newPost.save();
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
  const post = await getPostById(pid);
  if (!post){
    throw new Error('Post not found');
  }
  post.postText = newText;
  post.postImage = newPicture;
  return await post.save();
};

// Function to delete post by id
const deletePost = async (pid) => {
  const post = await getPostById(pid);
  if (!post) {
    throw new Error('Post not found');
  }
  await post.deleteOne();
  return post;

};


module.exports = { createPost, getPostById ,updatePost, deletePost }