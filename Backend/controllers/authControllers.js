import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

// Register user
export const registerUser = async(req, res) => {
    console.log("➡️ Incoming Register Request:", req.body);

    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const user = await User.create({ name, email, password });

        console.log(" User created:", user);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id) // no password here
        });
    } catch (err) {
        console.error(" Error creating user:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Login user
export const loginUser = async(req, res) => {
    console.log("Incoming Login Request:", req.body);

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // no password here
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(" Error logging in:", error.message);
        res.status(500).json({ message: error.message });
    }
};