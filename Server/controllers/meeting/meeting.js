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
    return res.status(201).json(meeting);
  } catch (err) {
    console.error("Error :", err);
    return res.status(400).json({ err, error: "Something wents wrong" });
  }
};

// READ - List all non-deleted meetings
const index = async (req, res) => {
  try {
    const meetings = await MeetingHistory.find({ deleted: false })
      .populate('attendes')
      .populate('attendesLead')
      .populate('createBy');
    return res.status(200).json(meetings);
  } catch (err) {
    console.error("Error :", err);
    return res.status(400).json({ err, error: "Something wents wrong" });
  }
};

// READ - View a specific meeting by ID
const view = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await MeetingHistory.findById(id)
      .populate('attendes')
      .populate('attendesLead')
      .populate('createBy');
    if (!meeting || meeting.deleted) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    return res.status(200).json(meeting);
  } catch (err) {
    console.error("Error :", err);
    return res.status(400).json({ err, error: "Something wents wrong" });
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
    res.status(200).send('Meeting deleted (soft delete)');
  } catch (err) {
    console.error("Error :", err);
    return res.status(400).json({ err, error: "Something wents wrong" });
  }
};

// DELETE - Soft delete multiple meetings by IDs
const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body; // Expect: { ids: ["id1", "id2", ...] }
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Invalid input, array of IDs required' });
    }

    await MeetingHistory.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.status(200).send('Meetings Deleted');
  } catch (error) {
    console.error("Error :", err);
    return res.status(400).json({ err, error: "Something wents wrong" });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
