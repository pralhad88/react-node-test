const express = require('express');
const meeting = require('./meeting');
const auth = require('../../middelwares/auth');

const router = express.Router();

// Get all meetings
router.get('/', auth, meeting.index);

// Add a single meeting
router.post('/add', auth, meeting.add);

// View a specific meeting by ID
router.get('/view/:id', auth, meeting.view);

// Soft delete a specific meeting by ID
router.delete('/delete/:id', auth, meeting.deleteData);

// Soft delete multiple meetings
router.post('/deleteMany', auth, meeting.deleteMany);

module.exports = router;
