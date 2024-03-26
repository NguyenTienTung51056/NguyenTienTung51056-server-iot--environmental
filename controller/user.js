import User from "../model/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


const register = async (req, res) => {
    const { user_name, email, password } = req.body;
    try {
        if (!user_name || !email || !password) {
            return res.status(400).json({ message: 'Please provide email and user name and password' });
        }
        const existingUserEmail = await User.findOne({ email });
        const existingUserName = await User.findOne({ user_name });
        if (existingUserEmail && existingUserName) {
            return res.status(400).json({ message: 'User already exists' });

        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({ user_name, email, password: hashedPassword, role: "user" });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }

};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser || existingUser.role !== "user") {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ user_id: existingUser._id, email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ user: { user_id: existingUser._id, user_name: existingUser.user_name, email: existingUser.email }, token });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser || existingUser.role !== "admin" && existingUser.role !== "admin-vip") {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ email: existingUser.email, user_id: existingUser._id, role: existingUser.role }, JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({ user: { user_id: existingUser._id, user_name: existingUser.user_name, email: existingUser.email }, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const users = async (req, res) => {
    const { user_role } = req;
    try {
        if (user_role === "user" || user_role === undefined) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { user_role } = req;
    const { user_id } = req.body
    const { user_name, email, password, role } = req.body;
    try {
        if (user_role === "user" || user_role === "admin" || user_role === undefined) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (!user_id) {
            return res.status(400).json({ message: 'Please provide user id' });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user_name) {
            user.user_name = user_name;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            user.password = hashedPassword;
        }
        if (role) {
            user.role = role;
        }
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { register, login, loginAdmin, users, updateUser }