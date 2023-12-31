const User = require('../models/userModel');
const wrapAsync = require('../helpers/wrapAsync');
const jwt = require('jsonwebtoken');

const isLoggedIn = wrapAsync( async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {

            //extract token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //find user by token id
            req.user = await User.findById(decoded.id).select('-password');

            next();

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized.');
        }
    };
    if(!token){
        res.status(401);
        throw new Error('Noth authorized, no token');
    }
});

module.exports = { isLoggedIn };