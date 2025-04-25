function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
      console.log("User not authenticated. Redirecting to login.");
      return res.redirect('/login');
    }
  }
  
  module.exports = { isAuthenticated };
  