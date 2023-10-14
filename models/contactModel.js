const mongoose = require('mongoose');

//name validator

//phone number validator

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Contact', contactSchema);