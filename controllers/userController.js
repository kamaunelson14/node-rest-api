const User = require('../models/userModel');
const wrapAsync = require('../helpers/wrapAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = wrapAsync( async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    //check if user exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
        name, 
        email, 
        password: hashedPassword
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }else {
        res.status(400);
        throw new Error('Invalid user data.');
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = wrapAsync( async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error('Please fill in all fields.');
    }

    //search for user by email
    const user = await User.findOne({email});

    //authenticate user and attach JWT
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials.');
    };
});

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    });
};

module.exports = {registerUser, loginUser};