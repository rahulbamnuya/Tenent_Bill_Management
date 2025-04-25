// utils/sessionManager.js

// Create session after login
function createSession(req, userData) {
    req.session.user = {
      id: userData.id,
      username: userData.username,
      email: userData.email
    };
  }
  
  // Destroy session on logout
  function destroySession(req) {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  // Check if user is logged in (middleware)
  function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
        console.log(req.session);
        console.log('Session:', req.session.user);
        console.log('User not authenticated, redirecting to login page.');
      return res.redirect('/login');
    }
  }
  
  module.exports = {
    createSession,
    destroySession,
    isAuthenticated
  };
  