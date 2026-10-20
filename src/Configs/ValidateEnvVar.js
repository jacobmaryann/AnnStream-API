import dotenv from 'dotenv';
dotenv.config();
import joi from 'joi';

const EnvVarSchema = joi.object ({
    PORT: joi.number().required(),
    MongoDB_URI: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_KEY: joi.string().required(),
    CLOUDINARY_SECRET: joi.string().required()
}).unknown();
    const { error, value: validateEnvVars } = EnvVarSchema.validate(process.env);
    if (error) {
        throw new Error(`Environment variable validation error: ${error.details[0].message}`);
    };


export default validateEnvVars ;