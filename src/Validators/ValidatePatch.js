
import asyncHandler from "express-async-handler";
import Joi from "joi";

const validatePatchSchema = Joi.object({
    company: Joi.string().min(3).optional(),
    title: Joi.string().min(3).optional(),
    description: Joi.string().min(20).optional(),
    location: Joi.string().min(3).optional(),
    salary: Joi.number().positive().optional()
});

const validateUpdate = asyncHandler(async (req, res, next) => {
    await validatePatchSchema.validateAsync(req.body);
    next();
});

export  { validateUpdate };

