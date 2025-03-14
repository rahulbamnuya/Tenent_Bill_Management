const express = require("express");
const { LoginUsers } = require("./firebase"); // Updated collection name

const router = express.Router();

// Route to add user with email & password (without authentication)
router.post("/add-user", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userDoc = await LoginUsers.doc(email).get();
        if (userDoc.exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Save user data in Firestore
        await LoginUsers.doc(email).set({
            name,
            email,
            password, // NOTE: Store password as plain text (not recommended for real applications)
            createdAt: new Date()
        });

        res.status(201).json({ message: "User stored successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
