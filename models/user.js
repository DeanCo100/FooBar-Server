const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String, // It whould be treated like a different type because its a picture, I need to figure it out.
    required: true
  }
  // Maybe I need to add here a field of 'token' which will be the user's JWT
  


})

const User = mongoose.model('User', UserSchema);

module.exports = User;