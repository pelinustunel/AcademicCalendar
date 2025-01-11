const Event = require("../models/Event");
const Calendar = require("../models/Calendar");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, fallStartDate, fallEndDate, springStartDate, springEndDate, calendar } = req.body;

    const relatedCalendar = await Calendar.findById(calendar);
    if (!relatedCalendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    const eventDates = [
      { start: new Date(fallStartDate), end: new Date(fallEndDate) },
      { start: new Date(springStartDate), end: new Date(springEndDate) }
    ];

    for (const { start, end } of eventDates) {
      if (start < new Date(relatedCalendar.startDate) || end > new Date(relatedCalendar.endDate)) {
        return res.status(400).json({
          message: "Event dates must be within the calendar's date range",
          calendarRange: {
            start: relatedCalendar.startDate,
            end: relatedCalendar.endDate
          }
        });
      }
    }

    const event = await Event.create({
      title,
      description,
      fallStartDate,
      fallEndDate,
      springStartDate,
      springEndDate,
      calendar,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("calendar", "name").populate("createdBy", "firstName lastName");
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("calendar", "name")
      .populate("createdBy", "firstName lastName");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await Event.find({ calendar: req.params.calendarId })
      .populate("calendar", "name")
      .populate("createdBy", "firstName lastName");

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { startDate, endDate, calendar } = req.body;

    if (startDate || endDate || calendar) {
      const calendarId = calendar || (await Event.findById(req.params.id)).calendar;
      const relatedCalendar = await Calendar.findById(calendarId);

      if (!relatedCalendar) {
        return res.status(404).json({ message: "Calendar not found" });
      }

      const existingEvent = await Event.findById(req.params.id);
      const eventStart = new Date(startDate || existingEvent.startDate).getTime();
      const eventEnd = new Date(endDate || existingEvent.endDate).getTime();
      const calendarStart = new Date(relatedCalendar.startDate).getTime();
      const calendarEnd = new Date(relatedCalendar.endDate).getTime();

      if (eventStart < calendarStart || eventEnd > calendarEnd) {
        return res.status(400).json({
          message: "Event dates must be within the calendar's date range",
          calendarRange: {
            start: relatedCalendar.startDate,
            end: relatedCalendar.endDate,
          },
        });
      }
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};