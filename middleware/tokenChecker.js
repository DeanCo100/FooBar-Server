const isValidToken= (req, res, next) => {
    // If the request has an authorization header
    if (req.headers.authorization) {
    // Extract the token from that header
    const token = req.headers.authorization.split(" ")[1];
    try {
    // Verify the token is valid
    const data = jwt.verify(token, key);
    // Token validation was successful. Continue to the actual function (index)
    return next()
    } catch (err) {
        res.redirect(301, '/api/login');
    }
    }
    else
    return res.status(403).send('Token required');
    }