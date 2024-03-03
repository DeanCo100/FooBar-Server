const Post = require('../models/post');



  const createPost = async (username, time, profilePic, text, picture) => {
    const post = new Post (
      {username: username, time: time, profilePic: profilePic, text: text, picture: picture}
    );

  return await post.save();
}
module.exports = { createPost }