import asyncHandler from "express-async-handler";
import Joi from "joi";

const validatePostSchema = Joi.object({
    company: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    description: Joi.string().min(20).required(),
    location: Joi.string().min(3).required(),
    workModel: Joi.string().required(),
    salary: Joi.number().positive().required(),
    expirationDate: Joi.date().required()
});

const validatePost = asyncHandler(async (req, res, next) => {
    await validatePostSchema.validateAsync(req.body);
    next(); 
});

export  { validatePost };