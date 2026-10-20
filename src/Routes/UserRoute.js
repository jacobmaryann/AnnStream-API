import express from "express";
import { registerUser, loginUser, getMyProfile, addProfilePicture} from "../Controllers/UserController.js";
import {validateUserSignUp, validateUserLogIn} from "../Validators/ValidateUser.js";
import authRequired from "../Middleware/Authentication.js";
import upload from "../Middleware/Multer.js";

const router = express.Router();

router.post('/auth/signup', validateUserSignUp, registerUser);

router.post('/auth/login', validateUserLogIn, loginUser);

router.get('/profile', authRequired, getMyProfile);

router.post('/profile/picture', authRequired, upload.single('profilePicture'), addProfilePicture);

export default router;