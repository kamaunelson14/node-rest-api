const wrapAsync = require('../helpers/wrapAsync');
const Contact = require('../models/contactModel');

// @desc    Post a contact
// @route   POST /api/contacts
// @access  Private
const postContact = wrapAsync( async (req, res) => {
    const {name, phoneNumber, address} = req.body;
    //prevent duplicate name
    const nameExists = await Contact.findOne({name});
    if(nameExists){
        res.status(400);
        throw new Error('Name is already in use.');
    }
    //prevent duplicate phone number
    const contacts = await Contact.find({});
    if(contacts.some(contact => contact.phoneNumber === phoneNumber)){
        res.status(400);
        throw new Error('Phone number is already saved');
    }

    //create contact
    const contact = await Contact.create({
        name,
        phoneNumber,
        address
    });
    res.status(201).json(contact);
});

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = wrapAsync( async (req, res) => {
    const contacts = await Contact.find().sort({_id: -1});
    res.status(200).json(contacts);
});

// @desc    Get one contact
// @route   GET /api/contacts/:id
// @access  Private
const getContact = wrapAsync(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(400);
        throw new Error('Contact not found.');
    }
    res.status(200).json(contact);
});

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = wrapAsync( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(400);
        throw new Error('Contact not found.');
    }
    //prevent duplicate name
    const nameExists = await Contact.findOne({name: req.body.name});
    if(nameExists){
        res.status(400);
        throw new Error('Name is already in use.');
    }
    //prevent duplicate phone number
    const contacts = await Contact.find({});
    if(contacts.some(contact => contact.phoneNumber === req.body.phoneNumber)){
        res.status(400);
        throw new Error('Phone number is already saved');
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(updatedContact);
});

// @desc        Delete a contact
// @route       DELETE /api/contacts/:id
// @access      Private
const deleteContact = wrapAsync( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(400);
        throw new Error('Contact not found.');
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({message: 'Contact deleted'});
});

module.exports = {
    getContacts,
    getContact,
    postContact,
    updateContact,
    deleteContact
}