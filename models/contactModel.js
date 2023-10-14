const mongoose = require('mongoose');
const {encrypt, decrypt} = require('../helpers/encryptionHandler');

//name validator
function validateName(name) {
    //remove whitespace from both ends
    const str = name.trim();
    // Define the regular expression for name validation
    const nameRegex = /^[a-zA-Z\s]+$/;
     // Test the name against the regex and check length
    return nameRegex.test(str) && str.length >= 2 && str.length <= 50;
}

//phone number validator
function validatePhoneNumber(phoneNumber){
    // Define the regular expression for phone number validation
    const phoneRegex = /^\d{10}$/; //matches a 10-digit phone number

    // Test the phone number against the regex
    return phoneRegex.test(phoneNumber);
}

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: {
            validator: validateName,
            message: props => `${props.value} is not a valid name.`
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true,
        validate: {
            validator: validatePhoneNumber,
            message: props => `${props.value} is not a valid phone number.`
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    }
}, {timestamps: true});

//Hook to encrypt phone and address fields
contactSchema.pre('save', function (next){
    this.phoneNumber = encrypt(this.phoneNumber, process.env.CRYPTO_SECRET_KEY);
    this.address = encrypt(this.address, process.env.CRYPTO_SECRET_KEY);
    next();
});

//Hook schema to decrypt phone and address fields
contactSchema.post('findOne', function (doc) {
    if(doc !== null){
        decrypt(doc.phoneNumber, process.env.CRYPTO_SECRET_KEY).then(res => doc.phoneNumber = res);
        decrypt(doc.address, process.env.CRYPTO_SECRET_KEY).then(res => doc.address = res);
    }
});

//Hook to return a custom message for unique Phone field
contactSchema.post('save', (err, doc, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new Error('Phone number is already saved.'));
    } else {
      next(err);
    }
});


module.exports = mongoose.model('Contact', contactSchema);