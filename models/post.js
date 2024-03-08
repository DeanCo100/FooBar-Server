const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
  
  posterUsername: { // THE USER'S USERNAME
    type: String,
    required: true
  },
  username: { //THE USER'S DISPLAY NAME
    type: String,
    required: true
  }, //**** Maybe I need to have the token aswell here, to identify the user's posts */
  time: {
    type: String,
    default: () => {
        const now = new Date();
        // Get the current date, hour, and minutes
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // Construct the string in the desired format: YYYY-MM-DD HH:mm
        return `${year}-${month}-${day} ${hour}:${minutes}`;
    }
  },
  profilePic: { // THE USER'S PICTURE
    type: String, // It whould be treated like a different type because its a picture, I need to figure it out.
    required: true
  },
  text : {
    type: String,
    required: true
  }, 
  picture: {
    type: String // Need to figute out what type to use
  },
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;