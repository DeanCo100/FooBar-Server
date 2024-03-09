const postService = require ('../services/post');

// Function to create a new post
// REMARK: will be changed later
const createPost = async (req, res) => {
  //  I need to figure out how to use the user's picture and username.
  try {
      res.json(await postService.createPost(req.body.posterUsername,req.body.username, req.body.userPic, req.body.postText, req.body.postImage, req.body.postTime));
  } catch (error) {
      // Handle errors
      console.log(error);
  }
};
//const getAllPosts = async (req, res) => {
//
//}

// Function to update an existing post
// REMARKS: Which id to use in order to find the post, 
//          Deal with the picture format
const updatePost = async (req, res) => {
  try {
    // Maybe need to change to : req.body.pid if will decide to add pid field to model
    const post = await postService.updatePost(req.params.pid, req.body.postText,
      req.body.postImage);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: ['Post not found'] });
  }
};

// Function to delete an existing post
// REMARKS: Which id to use in order to find the post, 
//          Deal with the picture format
const deletePost = async (req, res) => {
  try {
    // Maybe need to change to : req.body.pid if will decide to add pid field to model
    const deletedPost = await postService.deletePost(req.params.pid);
    res.json(deletedPost);
  } catch (error) {
    res.status(404).json({ error: ['Post not found'] });
  }
};



module.exports = { createPost, updatePost, deletePost }
// We need to give a JWT to the user when he log in.