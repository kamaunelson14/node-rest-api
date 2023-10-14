const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/authMiddleware');
const {
    getContacts,
    getContact,
    postContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

router.get('/',isLoggedIn, getContacts);

router.get('/:id', isLoggedIn, getContact);

router.post('/', isLoggedIn, postContact);

router.put('/:id', isLoggedIn, updateContact);

router.delete('/:id', isLoggedIn, deleteContact);

module.exports = router;