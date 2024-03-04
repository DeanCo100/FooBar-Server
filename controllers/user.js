const userService = require ('../services/user');

// Try to create a user, if there is an error I catch it and present on the user's screen the relevant message by the client fucntion.
const createUser = async (req, res) => {
  try {
    res.json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
  } catch (error) {
    res.status(401).json({error: 'Username already taken. Please select a different username'})
  }
}
// Try to login the user, if there is an error I catch it and present on the user's screen the relevant message by the client function.
const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body.username, req.body.password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Incorrect username or password' });
  }
};

module.exports = { createUser, loginUser }
// We need to give a JWT to the user when he log in.