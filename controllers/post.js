const postService = require ('../services/post');

// Function to create a new post
// REMARK: will be changed later
const createPost = async (req, res) => {
  //  I need to figure out how to use the user's picture and username.
  try {
      res.json(await postService.createPost(req.body.posterUsername,req.body.username, req.body.userPic, req.body.postText, req.body.postImage, req.body.postTime));
  } catch (error) {
      // Handle errors
      res.status(404).json({ error: ['User not found'] });
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

// Function to fill the feed with posts
// REMARKS: 1. sorted list of: 20 posts of friends, 5 posts of other users
//          2. which variable do I need to send to the service method
//          3. think of possible errors and how to deal with them
//          4. how to know if the given user is a friend or not?
const getFeedPosts = async (req, res) => {
  try {
    const feedPostsList = await postService.getFeedPosts();
    res.json(feedPostsList);
  } catch (error) {
    console.log(error);
  }
}



module.exports = { createPost, updatePost, deletePost, getFeedPosts}
// We need to give a JWT to the user when he log in.