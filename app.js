const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
// let Users; // Declare Users here

// // Asynchronously initialize Firebase and assign Users
// (async () => {
//   const firebaseModule = await import('./firebase.mjs');
//   Users = firebaseModule.Users; // Assign the Users collection from firebase.mjs
// })();
 // Import Firestore methods
const Users = require("./firebase.mjs");
const { addDoc } = require("firebase/firestore");

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
// Route for the home page
app.get('/home', (req, res) => {
  res.render('home'); // Render the home page
});
///X
app.get("/detail",(req,res)=>{
  res.render("detail")
})
///X
app.get("/addTenant",(req,res)=>{
  res.render("addTenant")
})
///X
app.get("/add_new_bill",(req,res)=>{
  res.render("add_new_bill")
})
app.get("/view_tenent",(req,res)=>{
  res.render("view_tenent")
})

app.get("/history",(req,res)=>{
  res.render("history")
})

// POST route to handle form submission
app.post('/add_new', (req, res) => {
    const { name, mobile, room, previousAddress } = req.body;

    // Log received data
    console.log("Name: ", name);
    console.log("Mobile: ", mobile);
    console.log("Room: ", room);
    console.log("Previous Address: ", previousAddress);

    // Optional: Log file upload (if you have file input in form)
    if (req.file) {
        console.log("Uploaded file: ", req.file.filename);
    }

    res.redirect('/home');
});


app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Add a new document to the "Users" collection
    const newUserRef = await addDoc(Users, { name, email });
    console.log(`User added with ID: ${newUserRef.id}`);
res.send("add successfully")
    res.redirect("/home");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});


app.get("/help",(req,res)=>{
  res.render("help_bill")
})

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
