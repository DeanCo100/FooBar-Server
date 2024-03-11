const postService = require ('../services/post');
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY;

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
const getFeedPosts = async (req, res) => {
  try {
    // Decode the JWT to get the username of the connected user
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const decodedUsername = decodedToken.username;
    // Fetch all posts from the database
    const posts = await postService.getFeedPosts(decodedUsername);
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

// Function to handle the like
const updatePostLikeStatus = async (req, res) => {
  try {
    const { id, pid } = req.params; // id is the current user's username, pid is the post's id
    const { isLiked } = req.body;
    console.log(isLiked);
    // Call the service function to update the post like status
    const response = await postService.updatePostLikeStatus(id, pid, isLiked);

    // Check if the service function was successful
    if (response.success) {
      // Return success response to the client
      return res.json({ success: true, likeCount: response.likeCount });
    } else {
      // Return failure response to the client with appropriate message
      return res.status(404).json({ success: false, message: response.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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



module.exports = { createPost, updatePost, deletePost, getFriendPosts, getFeedPosts, updatePostLikeStatus
}
// We need to give a JWT to the user when he log in.