const express = require('express');
const router = express.Router();
const Person = require("../model/Person");
const { jwtMiddlewareAuth, generateToken } = require('../Jwt');

// User Sign up
router.post("/signup", async (req, res) => {
    const data = req.body;
    const newPerson = new Person(data);
    try {
        const response = await newPerson.save();
        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload);
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// User Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Person.findOne({ username: username });
    try {
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ 'error': 'username or Password is incorrect' })
        }
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// User Profile view via Payload using token
router.get("/profile", jwtMiddlewareAuth, async (req, res) => {
    try {
        userData = req.userDetails;
        // userId = userData.id;
        const user = await Person.findById(userData.id);
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
// Fetch all data present in the database
router.get("/", jwtMiddlewareAuth, async (req, res) => {
    try {
        const response = await Person.find();
        console.log("data fetched successfully");
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
})

// fetch data using Paramaterised Url
router.get("/:workType", async (req, res) => {
    try {
        const workPost = req.params.workType;
        if (workPost === "manager" || workPost === "developer" || workPost === "coordinator") {
            const response = await Person.find({ work: workPost });
            console.log("details fetched");
            res.status(201).json(response);
        } else {
            console.log("invalid work type");
            res.status(401).json({ error: "Invalid work type" });
        }
    } catch (err) {
        res.status(501).json({ error: "Internal server error" });
    }
})

// update Record
router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updateInfoDetails = req.body;

        const response = await Person.findByIdAndUpdate(userId, updateInfoDetails, {
            new: true, // return the updated document
            runValidators: true //run moongoose schema validation
        });
        if (!response) {
            res.status(404).json("person not found");
        }
        console.log("updated successfully");
        res.status(201).json(response);

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
})
// delete record
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const response = await Person.findByIdAndDelete(userId);
        if (!response) {
            res.status(404).json("person not found");
        }
        res.status(201).json("deleted successfully");

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }

})

module.exports = router;