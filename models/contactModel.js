const mongoose = require('mongoose');
const {encrypt, decrypt} = require('../helpers/encryptionHandler');

// custom name validator
const nameValidator = (name) => {
    const nameRegex = /[a-zA-Z]/;//at least one letter of the alphabet
    return nameRegex.test(name) && name.length > 1 && name.length <= 20;
}

//phone number validator
const phoneNumberValidator = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; //matches a 10-digit phone number
    // Test the phone number against the regex
    return phoneRegex.test(phoneNumber);
}

//Define contact schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        validate: {
            validator: nameValidator,
            message: props => `${props.value} is not a valid name.`
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true,
        validate: {
            validator: phoneNumberValidator,
            message: props => `${props.value} is not a valid phone number.`
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    }
}, {timestamps: true});

//encrypt phone and address fields when posting new contact
contactSchema.pre('save', function (next){
    this.phoneNumber = encrypt(this.phoneNumber, process.env.CRYPTO_SECRET_KEY);
    this.address = encrypt(this.address, process.env.CRYPTO_SECRET_KEY);
    next();
});

//encrypt phone and address fields when updating contact
contactSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();

    //if phoneNumber is being updated, encrypt the value
   if(update.phoneNumber){
    update.phoneNumber = encrypt(update.phoneNumber, process.env.CRYPTO_SECRET_KEY)
   }

   //if address is being updated, encrypt the value
   if(update.address){
    update.address = encrypt(update.address, process.env.CRYPTO_SECRET_KEY);
   }

    next();
});

//decrypt phone and address fields when fetching one contact
contactSchema.post('findOne', function (doc) {
    //if doc is found, decrypt
    if(doc !== null){
        decrypt(doc.phoneNumber, process.env.CRYPTO_SECRET_KEY).then(res => doc.phoneNumber = res);
        decrypt(doc.address, process.env.CRYPTO_SECRET_KEY).then(res => doc.address = res);
    }
});

//decrypt phone and address field when fetching all contacts
contactSchema.post('find', function(docs) {
    //if docs is not empty, decrypt
    if(docs.length > 0){
        const promises = docs.map(doc => {
            return Promise.all([
                decrypt(doc.phoneNumber, process.env.CRYPTO_SECRET_KEY).then(res => doc.phoneNumber = res),
                decrypt(doc.address, process.env.CRYPTO_SECRET_KEY).then(res => doc.address = res)
            ]);
        });

        return Promise.all(promises);
    }
});

module.exports = mongoose.model('Contact', contactSchema);