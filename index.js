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

// Route to display the add user form
app.get("/",(req,res)=>{
  res.render("login")
})

app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("User trying to log in:", email);

  if (!email || !password) {
    return res.redirect("/login?error=All fields are required!");
  }

  try {
    const userDoc = await LoginUsers.doc(email).get();

    if (userDoc.exists) {
      console.log("✅ User found! Redirecting to home...");
      console.log(`User email id is:", ${email}`);

      const newPrice = 1;
      const tenent_count = 1;

      return res.render("home", { userEmail: email, newPrice, tenent_count });
    } else {
      console.log("❌ User not found! Redirecting to signup...");
      return res.redirect("/signup?error=User not found! Please sign up.");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return res.redirect("/login?error=Internal server error.");
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
      console.log("❌ User already exists! Redirecting to login...");
      return res.redirect("/login?error=User already exists! Please log in.");
    }

    // Save user data in Firestore
    await LoginUsers.doc(email).set({
      name,
      email,
      password, // ⚠️ Store as plain text (not recommended, use bcrypt for hashing)
      createdAt: new Date(),
    });

    console.log(`✅ New user registered: ${email}`);

    const newPrice = 1;
    const tenent_count = 1;

    return res.render("home", { userEmail: email, newPrice, tenent_count });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.redirect("/signup?error=Internal server error.");
  }
});


app.get("/add", (req, res) => {
    res.render("index"); // Render the add_user.ejs file
});

app.post("/edit_bill_amount", async (req, res) => {
 
 
  const newPrice = req.body.newPrice; // Access newPrice from req.body
  console.log(newPrice);

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
        console.log(userId);
        res.render("detail", { userId: userId, userData: userData });
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).send("Internal Server Error");
    }
});

///X
app.get("/addTenant",(req,res)=>{
  const userEmail = req.query.email || "guest@example.com"; // Get email from URL
  console.log(userEmail)
  res.render("addTenant",{userEmail:userEmail})
})
app.post("/add_new",async (req,res)=>{
   try {
        const { name, mobile, room,previousAddress,RoomRent,userEmail } = req.body; // Get data from the form
        console.log(name,mobile,room,previousAddress,RoomRent,userEmail)
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
   console.log(userId)
  res.render("add_new_bill",{userId:userId})
})
app.post("/add_new_bill/:id", async (req,res)=>{
   const userId = req.params.id;
  console.log("hello")
   console.log(userId)
  const tenent_id=userId;
   const { previous_reading, current_reading,bill_date } = req.body;
   const month_reading=current_reading-previous_reading;
   console.log("New reading is",month_reading)
   const bill_amount=10*month_reading;
   console.log("bill is",bill_amount)
  console.log(previous_reading, current_reading,bill_date )
  const bill_add_history=await Tenants_bill_history.add({current_reading,previous_reading,month_reading,bill_amount,bill_date,tenent_id})
const id=bill_add_history.id;
const bill_id=await Tenants_bill_history.doc(id).get();
const data=bill_id.data();
console.log("BIll id",bill_id.id)
console.log("tenent id",data.tenent_id)
console.log("bill amountg",data.bill_amount)
console.log("month reading",data.month_reading)
console.log("bill date",data.bill_date)
console.log("current reading",data.current_reading)
console.log("previous reading",data.previous_reading)
});

app.get("/view_tenent", async (req, res) => {
  const userEmail = req.query.email || "guest@example.com"; // ✅ Declare userEmail outside try

  try {
    console.log(`Searching for tenants with email: ${userEmail}`);

    // Query Firestore for tenants with matching email
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
        email: userData.email, // ✅ Ensure email is stored in Firestore
      });
    });

    // ✅ If no users found, throw an error
    if (users.length === 0) {
      throw new Error("No tenants found for the given email.");
    }

    console.log(`Found tenants: ${JSON.stringify(users)}`);
    
    // Render the view with filtered users
    res.render("view_tenent", { users });
  } catch (error) {
    console.error("Error fetching tenants:", error.message);

    res.redirect('/view_tenent_error?email=' + encodeURIComponent(userEmail)); // ✅ userEmail is now accessible
  }
});



app.get("/view_tenent_error",(req,res)=>{
  const userEmail = req.query.email || "guest@example.com"; // Get email from URL
    console.log(userEmail)
  res.redirect('/addTenant?email=' + encodeURIComponent(userEmail))
})
app.get('/edit_tenent/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userdta=await Tenants.doc(userId).get();
  const userData= userdta.data();
  
console.log(userId)
  res.render('edit_tenent', { userId: userId ,userData:userData});
});

app.post("/edit_tenent/:userId",async (req,res)=>{
  
 const userId = req.params.userId;
const{name,mobile,previousAddress,RoomRent}=req.body;
console.log(name,mobile,previousAddress,RoomRent)
await Tenants.doc(userId).update({name,mobile,previousAddress,RoomRent})
res.redirect("/view_tenent")
})
app.get("/Tenent_bill_history/:id",async(req,res)=>{
  try{
    const userId = req.params.id;
    console.log(userId)
    console.log("hi")
res.render("Tenent_bill_history")

  }catch(error){
    console.log(error)
    res.render("Tenent_bill_history_error",{userId:userId})
  }
 
})
app.get("/Tenent_bill_history_error/:id",(req,res)=>{
  const userId = req.params.id;
  console.log(userId)
  console.log("bye")
  res.render("Tenent_bill_history_error",{userId:userId})
})
app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await Users.get(); // Fetch all users from Firestore
    const users = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      console.log(userData);
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
        console.log(`User added with ID: ${newUserRef.id}`);
        
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
const Port = process.env.PORT || 8000
app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});
