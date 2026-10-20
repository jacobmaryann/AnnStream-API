const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
             res.status(401);
            throw new Error({ error: 'Access denied, Unauthorized' });
        }
        if (req.user.role === 'admin') {
            return next()
        }
        if (!roles.includes(req.user.role)) {
             res.status(403);
            throw new Error({ error: 'Access denied, you do not have permission to perform this operation' });
        }
         next();
} };

export default authorize;