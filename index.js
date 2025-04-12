const express = require("express");
const path = require("path");
const Users = require("./firebase.ejs").Users; // Import Users collection
const Tenants=require("./firebase.ejs").Tenants;
const LoginUsers=require("./firebase.ejs").LoginUsers;
const Tenants_bill_history=require("./firebase.ejs").Tenants_bill_history
const app = express();
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
// console.log(Tenants)

const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');

app.use(session({
  secret: 'qwertyuiop', // 🔐 Session key
  resave: false,                        // Avoid resaving session if unmodified
  saveUninitialized: false,             // Don't save empty sessions
  cookie: {
    secure: false,                      // Set true only if using HTTPS
    maxAge: 1000 * 60 * 60 * 1          // 1 hour
  }
}));

// Route to display the add user form
app.get("/",(req, res) => {
   res.render("login")
});




app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/login?error=All fields are required!");
  }

  try {
    const userDoc = await LoginUsers.doc(email).get();

    if (userDoc.exists) {
      // ✅ Save user info in session
      req.session.user = {
        email: email,
        isLoggedIn: true
      };
console.log("User logged in:", email,req.session.user.isLoggedIn);
      // console.log("✅ User logged in and session started!");
      return res.redirect("/home");
    } else {
      // console.log("❌ User not found! Redirecting to signup...");
      return res.redirect("/signup?error=User not found! Please sign up.");
    }
  } catch (error) {
    // console.error("Login error:", error.message);
    return res.redirect("/login?error=Internal server error.");
  }
});
app.get("/home", async (req, res) => {
  // ✅ Use session to get email, not from query
  if (!req.session.user || !req.session.user.isLoggedIn) {
    return res.redirect("/login?error=Please log in first.");
  }

  const userEmail = req.session.user.email;

  try {
    // Fetch tenants from the database for the logged-in user
    const usersSnapshot = await Tenants.where("userEmail", "==", userEmail).get();
    
    // Count the number of tenants
    const tenent_count = usersSnapshot.size;

    // Dummy value for price (Replace with actual calculation if needed)
    const newPrice = 10;

    res.render("home", { userEmail, newPrice, tenent_count });
  } catch (error) {
    // console.error("Error loading home page:", error.message);
    res.redirect("/login?error=Failed to load home page.");
  }
});




app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.redirect("/signup?error=All fields are required!");
  }

  try {
    // Check if user already exists
    const userDoc = await LoginUsers.doc(email).get();
    if (userDoc.exists) {
      // console.log("❌ User already exists! Redirecting to login...");
      return res.redirect("/"); // ✅ Return here to prevent further execution
    }

    // Save user data in Firestore
    await LoginUsers.doc(email).set({
      name,
      email,
      password, // ⚠️ Store as plain text (not recommended, use bcrypt for hashing)
      createdAt: new Date(),
    });

    // console.log(`✅ New user registered: ${email}`);
    return res.redirect("/");
  } catch (error) {
    // console.error("Signup error:", error.message);
    return res.redirect("/signup?error=Internal server error.");
  }
});



app.get("/add", (req, res) => {
    res.render("index"); // Render the add_user.ejs file
});

app.post("/edit_bill_amount", async (req, res) => {
 
 
  const newPrice = req.body.newPrice; // Access newPrice from req.body
  // console.log(newPrice);

  // Now you have the newPrice value.  Use it to update your data.
  // For example, if you're using a variable to store the bill unit:

   //  Example: Store in a global variable

  // Or update in a database, etc.
const tenent_count=5
  res.render('home',{newPrice,tenent_count}); // Redirect back to the home page after update.
});






app.get("/detail/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Tenants.doc(userId).get();

        if (!user.exists) {
            return res.status(404).send("User not found.");
        }

        const userData = user.data();
        // console.log(userId);
        // console.log(userData)
        res.render("detail", { userId: userId, userData: userData });
    } catch (err) {
        // console.error("Error fetching user data:", err);
        res.status(500).send("Internal Server Error");
    }
});

///X
// app.js
app.get("/addTenant", (req, res) => {
  const userEmail = req.session.user ? req.session.user.email : null;  // Get email from session
  if (userEmail) {
    console.log("Session Email:", userEmail);
    res.render("addTenant", { userEmail: userEmail });
  } else {
    // If no session exists or the user is not logged in, redirect to login page
    res.redirect("/login?error=You need to log in first.");
  }
});


app.post("/add_new",async (req,res)=>{
   try {
        const { name, mobile, room,previousAddress,RoomRent,userEmail } = req.body; // Get data from the form
        // console.log(name,mobile,room,previousAddress,RoomRent,userEmail)
        const newUserRef = await Tenants.add({name,mobile,room,previousAddress,RoomRent,userEmail})
        console.log(`User added with ID: ${newUserRef.id}`);
        res.redirect('/view_tenent?email=' + encodeURIComponent(userEmail));
        // Redirect back to the form (or a success page)
        
    } catch (error) {
        console.error("Error adding user: ", error);
        res.status(500).send("Error adding user");
    }
})
///X
app.get("/add_new_bill/:id",(req,res)=>{
   const userId = req.params.id;
  //  console.log(userId)
  res.render("add_new_bill",{userId:userId})
})
app.post("/add_new_bill/:id", async (req,res)=>{
   const userId = req.params.id;
  // console.log("hello")
  //  console.log(userId)
  const tenent_id=userId;
   const { previous_reading, current_reading,bill_date } = req.body;
   const month_reading=current_reading-previous_reading;
  //  console.log("New reading is",month_reading)
   const bill_amount=10*month_reading;
  //  console.log("bill is",bill_amount)
  // console.log(previous_reading, current_reading,bill_date )
  const bill_add_history=await Tenants_bill_history.add({current_reading,previous_reading,month_reading,bill_amount,bill_date,tenent_id})
const id=bill_add_history.id;
const bill_id=await Tenants_bill_history.doc(id).get();
const data=bill_id.data();
// console.log("BIll id",bill_id.id)
// console.log("tenent id",data.tenent_id)
// console.log("bill amountg",data.bill_amount)
// console.log("month reading",data.month_reading)
// console.log("bill date",data.bill_date)
// console.log("current reading",data.current_reading)
// console.log("previous reading",data.previous_reading)
res.redirect("/Tenent_bill_history/"+data.tenent_id);
});

app.get("/view_tenent", async (req, res) => {
  // 🔒 Check if user is logged in
  if (!req.session.user || !req.session.user.isLoggedIn) {
    return res.redirect("/login?error=Please log in first.");
  }

  const userEmail = req.session.user.email;
  // console.log("Session Email:", userEmail);

  try {
    // console.log(`Searching for tenants with email: ${userEmail}`);

    const usersSnapshot = await Tenants.where("userEmail", "==", userEmail).get();

    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name,
        mobile: userData.mobile,
        room: userData.room,
        previousAddress: userData.previousAddress,
        RoomRent: userData.RoomRent,
        email: userData.email,
      });
    });

    if (users.length === 0) {
      // Optional: flash a message or render empty view
      return res.render("view_tenent", {
        users: [],
        userEmail,
        message: "No tenants found for your account.",
      });
    }

    res.render("view_tenent", { users, userEmail });
  } catch (error) {
    console.error("Error fetching tenants:", error.message);
    res.redirect("/home?error=Failed to fetch tenant data.");
  }
});


app.get("/view_tenent_error",(req,res)=>{
  const userEmail = req.query.email || "guest@example.com"; // Get email from URL
    // console.log(userEmail)
  res.render("view_tenent_error",{userEmail:userEmail})
})
// app.get("/view_tenent_error",(req,res)=>{
//   const userEmail = req.query.email || "guest@example.com"; // Get email from URL
//     console.log(userEmail)
//   res.redirect('/addTenant?email=' + encodeURIComponent(userEmail))
// })
app.get('/edit_tenent/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userdta=await Tenants.doc(userId).get();
  const userData= userdta.data();
  
// console.log(userId)
  res.render('edit_tenent', { userId: userId ,userData:userData});
});

app.post("/edit_tenent/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userEmail = req.query.email; // ✅ Declare userEmail outside try block

  const { name, mobile, previousAddress, RoomRent } = req.body;

  try {
      // console.log("Updating tenant:", { name, mobile, previousAddress, RoomRent });

      // Update the tenant's details
      await Tenants.doc(userId).update({ name, mobile, previousAddress, RoomRent });

      // Redirect to the tenant's view page with their ID and email
      res.redirect(`/detail/${userId}`);
  } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/Tenent_bill_history/:id", async (req, res) => {
  try {
    const tenantId = req.params.id;
    // console.log("Searching for bill history for Tenant ID:", tenantId);

    // Query Firestore for all bill history records with the specified tenantId
    const historySnapshot = await Tenants_bill_history.where("tenent_id", "==", tenantId).get();
    const billHistory = [];

    historySnapshot.forEach((doc) => {
      billHistory.push({ id: doc.id, ...doc.data() });
    });

    // console.log("Bill History:", billHistory);
    
    if (billHistory.length === 0) {
      // console.log("No bill history found for Tenant ID:", tenantId);
      return res.render("Tenent_bill_history_error", { userId: tenantId });
    }

    res.render("Tenent_bill_history", { history: billHistory });
  } catch (error) {
    // console.error("Error fetching bill history:", error);
    res.render("Tenent_bill_history_error", { userId: req.params.id });
  }
});
// Route to fetch and display bill details
app.get("/history/details/:tenant_id/:bill_id", async (req, res) => {
  const { tenant_id, bill_id } = req.params;

  try {
      const doc = await Tenants_bill_history.doc(bill_id).get();

      if (!doc.exists) {
          return res.status(404).json({ message: "Bill history not found." });
      }

      res.render("history-details", { 
          bill: { id: bill_id, ...doc.data() }, // Explicitly passing bill_id
          tenant_id 
      });
  } catch (error) {
      // console.error("Error fetching bill details:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});





app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await Users.get(); // Fetch all users from Firestore
    const users = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // console.log(userData);
      users.push({
        id: doc.id, // Include the document ID
        name: userData.name,
        email: userData.email,
        age: userData.age,
      });
    });

    res.render("view_users", { users: users }); // Render the EJS template with the user data
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});
// Route to handle form submission
app.post("/add-user", async (req, res) => {
    try {
        const { name, email, age } = req.body; // Get data from the form
        const newUserRef = await Users.add({ name, email, age });
        // console.log(`User added with ID: ${newUserRef.id}`);
        
        res.redirect('/add'); // Redirect back to the form (or a success page)
    } catch (error) {
        console.error("Error adding user: ", error);
        res.status(500).send("Error adding user");
    }
});
 


app.get('/edit-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDoc = await Users.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    console.log(userData.name)
    res.render('edit_user', { user: { id: userId, ...userData } }); 
  } catch (error) {
    console.error('Error fetching user for editing:', error);
    res.status(500).send('Error fetching user for editing');
  }
});

// Route to handle user update
app.post('/update-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, age } = req.body;

    await Users.doc(userId).update({ name, email, age });
    console.log(`User ${userId} updated successfully!`);
    res.redirect('/users'); 
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

// Route to handle user deletion
app.post('/delete-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await Users.doc(userId).delete();
    console.log(`User ${userId} deleted successfully!`);
    res.redirect('/users'); 
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});
// Start the server
app.get("/history",async(req,res)=>{
  
   

    const billHistorySnapshot = await Tenants_bill_history.get();

const billHistory = [];
billHistorySnapshot.forEach((doc) => {
    billHistory.push({
        id: doc.id, // Document ID
        ...doc.data() // Spread to get all fields
    });
});

console.log(billHistory);

    
});

    
// Define routes here

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.redirect('/');
});

// Start the server


const Port = process.env.PORT || 8000
app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});
