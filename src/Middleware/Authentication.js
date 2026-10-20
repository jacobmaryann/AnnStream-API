import jwt from 'jsonwebtoken';
import userModel from '../Models/UserModel.js';
import asyncHandler from 'express-async-handler';

const authRequired = asyncHandler(async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ error: 'Access denied, token required' });
    };

    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(payload.id);
    if (!user) {
        return res.status(401).json({ error: 'Access denied, user not found'})
    };
    req.user = user;
    next();
});

export default authRequired;