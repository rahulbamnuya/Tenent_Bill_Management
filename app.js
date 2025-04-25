const express = require('express');
const session = require('express-session');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'qwertyuiop',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Mount your routes
app.use('/', authRoutes);

// Dummy login page
app.get('/login', (req, res) => {
  res.send('<h2>Login Page</h2><a href="/loginnn">Simulate Login</a>');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
