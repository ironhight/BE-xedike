const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.token;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalid' });
        if (decoded) {
            req.user = decoded;
            return next();
        }
    });
};

const authorize = userType => {
    return (req, res, next) => {
        if (userType.findIndex(item => item === req.user.userType) !== -1)
            return next();

        res.status(403).json({ message: 'You have no permission' });
    };
};

module.exports = {
    authenticate,
    authorize
};
