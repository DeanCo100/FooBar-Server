const userService = require ('../services/user');

const createUser = async (req, res) => {
  res.json(await userService.createUser(req.body.username, req.body.displayName, req.body.password, req.body.profilePic));
};

module.exports = { createUser }
// We need to give a JWT to the user when he log in.