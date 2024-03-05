const User = require('../models/user');
const jwt = require("jsonwebtoken")

// Function to create a user
const createUser = async (username, displayName, password, profilePic) => {
  // Check if the DB if the username is already exists
  const existingUser = await User.findOne({ username });
  // If the username is already exists throw error indicates that.
  if (existingUser) {
    throw new Error('Username already taken. Please select a different username');
  }

   // Create a new user
   const newUser = new User({
    username,
    displayName,
    password,
    profilePic
  });
  return await newUser.save();

}


const loginUser = async (req, res) => {
 // Find the user in the database based on the provided username
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username });
 //handling the case that indeed the user is found
if (user && user.password === password) {
    res.status(201).json({ token: generatetoken(req,res)});
} else if (!user || user.password !== password) {
  throw new Error('Incorrect username or password');
}
};



// const tokenHandler = (req,res) => {
//   if (req.headers.authorization) {
//     // Extract the token from that header
//     const token = req.headers.authorization.split(" ")[1];
//     try {
//       // Verify the token is valid
//       const data = jwt.verify(token, key);
//       console.log('The logged in user is: ' + data.username);
//       // Token validation was successful. Continue to the actual function (index)
//       return user;
//       } catch (err) {
//         res.status(201).json({ token: generatetoken(req,res)});
//       }
//     }else{
//       return res.status(403).send('Token required');
//     }
// }


const generatetoken = (req,res) => {
  const data = { username: req.body.username}
  const key = process.env.SECRET_KEY;
  const token = jwt.sign(data, key,{ expiresIn:process.env.TOKEN_EXPIRATION })
  return token;
 
}


module.exports = { createUser, loginUser }



// Function to generate a JWT to the user
// const generateAndSaveToken = async (user) => {
//   // Generate a JWT token
//   const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });

//   // Save the token to the database
//   // Example code assuming User model has a tokens array field
//   user.tokens.push(token);
//   await user.save();

//   return token;
// };