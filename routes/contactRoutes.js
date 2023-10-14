const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');
const {
    getContacts,
    getContact,
    postContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

router.get('/', getContacts);

router.get('/:id', getContact);

router.post('/', postContact);

router.put('/:id', updateContact);

router.delete('/:id', deleteContact);

module.exports = router;