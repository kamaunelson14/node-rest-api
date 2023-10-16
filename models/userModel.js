const mongoose = require('mongoose');

// custom name validator
const nameValidator = (name) => {
    const nameRegex = /[a-zA-Z]/;
    return nameRegex.test(name) && name.length > 1 && name.length <= 20;
}

//custom email validator
const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: {
            validator: nameValidator,
            message: props => `${props.value} is not a valid name`
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.'],
        validate:{
            validator: emailValidator,
            message: props => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);