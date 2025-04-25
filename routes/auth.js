const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

// Dummy login route
router.get('/loginnn', (req, res) => {
  const username = "admin";
  const password = "1234";

  if (username === 'admin' && password === '1234') {
    req.session.user = {
      username: 'admin',
      email: 'admin@example.com'
    };
    console.log("Session set:", req.session);
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

// Protected route
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Hello, ${req.session.user.username}`);
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/dashboard");
    }
    console.log("Session destroyed. Redirecting to login.");
    res.redirect("/login");
  });
});

module.exports = router;
