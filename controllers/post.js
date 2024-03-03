const postService = require ('../services/post');

const createPost = async (req, res) => {
  //  I need to figure out how to use the user's picture and username.
  res.json(await postService.createPost(req.User.username, time, req.User.profilePic, req.body.text, req.body.picture));
};

module.exports = { createPost }
// We need to give a JWT to the user when he log in.