const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"]
  },
  description: {
    type: String
  },
  fallStartDate: {
    type: Date,
    required: [true, "Please add a start date for Fall semester"]
  },
  fallEndDate: {
    type: Date,
    required: [true, "Please add an end date for Fall semester"]
  },
  springStartDate: {
    type: Date,
    required: [true, "Please add a start date for Spring semester"]
  },
  springEndDate: {
    type: Date,
    required: [true, "Please add an end date for Spring semester"]
  },
  calendar: {
    type: mongoose.Schema.ObjectId,
    ref: "Calendar",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);