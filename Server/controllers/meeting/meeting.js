const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');

// CREATE - Add a new meeting
const add = async (req, res) => {
  const { userId } = req.user;
  const meetingPayload = req.body;
  meetingPayload['createBy'] = userId
  try {
    const meeting = new MeetingHistory(meetingPayload);
    await meeting.save();
    res.status(201).json({ success: true, message: 'Meeting created successfully', data: meeting });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// READ - List all non-deleted meetings
const index = async (req, res) => {
  try {
    const meetings = await MeetingHistory.find({ deleted: false })
      // .populate('attendes')
      // .populate('attendesLead')
      .populate('createBy');
    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ - View a specific meeting by ID
const view = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await MeetingHistory.findById(id)
      // .populate('attendes')
      // .populate('attendesLead')
      .populate('createBy');
    if (!meeting || meeting.deleted) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Soft delete a meeting by ID
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await MeetingHistory.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    res.json({ success: true, message: 'Meeting deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Soft delete multiple meetings by IDs
const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body; // Expect: { ids: ["id1", "id2", ...] }
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Invalid input, array of IDs required' });
    }

    const result = await MeetingHistory.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.json({ success: true, message: `${result.modifiedCount} meetings deleted` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
