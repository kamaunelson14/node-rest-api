const wrapAsync = require('../helpers/wrapAsync');

const Contact = require('../models/contactModel');

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = wrapAsync( async (req, res) => {
    const contacts = await Contact.find();
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

// @desc    Post a contact
// @route   POST /api/contacts
// @access  Private
const postContact = wrapAsync( async (req, res) => {
    const contact = await Contact.create({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
    });
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