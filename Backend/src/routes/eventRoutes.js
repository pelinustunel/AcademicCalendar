const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getCalendarEvents,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, authorize("admin"), createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("admin"), updateEvent)
  .delete(protect, authorize("admin"), deleteEvent);

router.get("/calendar/:calendarId", getCalendarEvents);

module.exports = router;
