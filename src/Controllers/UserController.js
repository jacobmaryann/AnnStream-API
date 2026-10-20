import userModel from '../Models/UserModel.js';
import asyncHandler from 'express-async-handler';
import { hashedPassword, comparePasswords } from '../utils/Password.js';
import generateToken from '../utils/GenToken.js';
import uploadToCloudinary from '../utils/CloudUpload.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;


    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
         res.status(400);
        throw new Error('User email already exists');
    }

    // Hash the password
    const hashed = await hashedPassword(password);

    // Create new user
    const newUser = new userModel({
        username,
        email,
        password: hashed,
        role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser)
    }
    });
});



const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if  (!user) {
         res.status(401);
            throw new Error('This user does not exist');
    }

    // Compare password
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
         res.status(401);
            throw new Error('Invalid credentials');
    }

    const token = generateToken(user);

    res.json({ message: 'User logged in successfully', data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
    } });
});


const getMyProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id).select('-password').lean(); 
    // Exclude password from the response 
    // using lean so that I get a plain JS object instead of a Mongoose document object

    if (!user) {
         res.status(404);
        throw new Error('User not found');
    }
    res.json({ message: 'User profile retrieved successfully', data: user });
});

const addProfilePicture = asyncHandler(async (req, res) => {

    const user = await userModel.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

       if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const upload = await uploadToCloudinary(req.file.buffer, "profile_pictures", true);
    user.profilePicture = upload.secure_url;
    await user.save();

    res.json({ message: 'Profile picture updated successfully', 
        data: { profilePicture: user.profilePicture } });
});


export  { registerUser, loginUser, getMyProfile, addProfilePicture };