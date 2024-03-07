const userService = require ('../services/user');

// Try to create a user, if there is an error I catch it and present on the user's screen the relevant message by the client fucntion.
const createUser = async (req, res) => {
  try {
    res.status(201).json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
  } catch (error) {
    res.status(401).json({error: 'Username already taken. Please select a different username'})
  }
}
// Try to login the user, if there is an error I catch it and present on the user's screen the relevant message by the client function.
// const loginUser = async (req, res) => {
//   try {
//     const user = await userService.loginUser(req.body.username, req.body.password);
//     res.json(user);
//   } catch (error) {
//     res.status(401).json({ error: 'Incorrect username or password' });
//   }
// };
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await userService.loginUser(username,password);
    if (token) {
      // If user is found and password matches, send success response
      res.status(201).json(token);
    } else {
      // If user is null, it means incorrect username or password
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  }  catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
module.exports = { createUser, loginUser }
// We need to give a JWT to the user when he log in.