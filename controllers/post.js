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

// Returns the friend's posts.
const getFriendPosts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
     // Assuming id is the username of the friend
    const { areFriends, friendPosts } = await postService.getFriendPosts(token, req.params.id);
    // Send the response based on whether they are friends or not
    if (areFriends) {
      res.status(200).json({ areFriends, friendPosts });
    } else {
      res.status(200).json({ areFriends, message: 'You are not friends with this user' });
    }
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

// Controller function to handle fetching all posts
const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'There are no posts yet' });
  }
};




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
//const getFeedPosts = async (req, res) => {
//  try {
//    const feedPostsList = await postService.getFeedPosts();
//    res.json(feedPostsList);
//  } catch (error) {
//    console.log(error);
//  }
//}



module.exports = { createPost, updatePost, deletePost, getFriendPosts, getAllPosts}
// We need to give a JWT to the user when he log in.