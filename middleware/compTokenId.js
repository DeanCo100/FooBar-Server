const jwt = require('jsonwebtoken');


// Middleware to verify token and match user ID
function verifyUser(req, res, next) {
  const token = req.headers.authentication && req.headers.authentication.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token is required');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the user ID from the token matches the ID in the route
    if (decoded.id !== req.params.id) {
      return res.status(403).send('Access denied: User ID does not match token');
    }

    // If it matches, add the decoded token to the request object (optional)
    req.user = decoded;

    next(); // Proceed to the next middleware/function
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).send('Invalid or expired token');
  }
}
module.exports = verifyUser;