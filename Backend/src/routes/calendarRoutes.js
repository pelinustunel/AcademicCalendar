const express = require("express");
const router = express.Router();
const {
  createCalendar,
  getCalendars,
  getCalendar,
  updateCalendar,
  deleteCalendar,
  exportCalendar,
} = require("../controllers/calendarController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getCalendars).post(protect, createCalendar);

router.route("/:id").get(getCalendar).put(updateCalendar).delete(deleteCalendar);

router.get("/:id/export", exportCalendar);

module.exports = router;
