import joi from 'joi';
import asyncHandler from 'express-async-handler';

const registerSchema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid('applicant', 'employer').default('applicant')
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

const validateUserSignUp = asyncHandler(async (req, res, next) => {
    await registerSchema.validateAsync(req.body);
    next();
});

const validateUserLogIn= asyncHandler(async (req, res, next) => {
    await loginSchema.validateAsync(req.body);
    next();
});

export { validateUserSignUp, validateUserLogIn };