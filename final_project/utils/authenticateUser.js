const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Check if the user is logged in and has valid access token
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];

    // Verify JWT token
    jwt.verify(token, 'access', (err, user) => {
      if (err)
        return res.status(403).json({
          message: 'User not authenticated',
        });

      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ message: 'User not logged in' });
  }
}

module.exports = auth;
