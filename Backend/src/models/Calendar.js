const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Calendar name is required"],
      unique: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Calendar", calendarSchema);
