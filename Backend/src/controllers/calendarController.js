const Calendar = require("../models/Calendar");
const Event = require("../models/Event");

exports.createCalendar = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const calendar = await Calendar.create({
      name,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: calendar });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find().populate("createdBy", "firstName lastName");
    res.json({ success: true, data: calendars });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id).populate("createdBy", "firstName lastName");
    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }
    res.json({ success: true, data: calendar });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }
    res.json({ success: true, data: calendar });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.exportCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    const events = await Event.find({ calendar: req.params.id });

    const exportData = {
      calendar: {
        name: calendar.name,
        startDate: calendar.startDate,
        endDate: calendar.endDate,
      },
      events: events.map((event) => ({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
      })),
    };

    res.json({ success: true, data: exportData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
