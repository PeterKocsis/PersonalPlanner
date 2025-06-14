const express = require("express");
const router = express.Router();
const {
  getTimeRangesFromDateRange,
  getNextTimeRange,
  getPreviousTimeRange,
  getTimeRange,
  getMonthTimeRange,
} = require("../utilities/time-range-helper");

router.get("", (req, res, next) => {
  const { startDate, endDate } = req.query;
  console.log("Received query parameters:", { startDate, endDate });
  // Validate query parameters
  try {
    const timeRanges = getTimeRangesFromDateRange(startDate, endDate);
    console.log("Fetched time ranges:", timeRanges);
    res.status(200).json({
      message: "Time ranges fetched successfully",
      timeRanges: timeRanges,
    });
  } catch (error) {
    console.error("Error fetching time ranges:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time ranges",
    });
  }
});

router.get("/week/current", (req, res, next) => {
  try {
    const timeRange = getTimeRange(new Date());
    console.log("Fetched time range for week:", timeRange);
    res.status(200).json({
      message: "Time range for week fetched successfully",
      timeRange: timeRange,
    });
  } catch (error) {
    console.error("Error fetching time range for week:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time range for week",
    });
  }
});

router.get("/week/next", (req, res, next) => {
  const { date } = req.query;
  console.log("Received query parameter for week:", { date });
  try {
    const converted = new Date(date);
    const timeRange = getNextTimeRange(getTimeRange(converted).endDate);
    console.log("Fetched time range for week:", timeRange);
    res.status(200).json({
      message: "Time range for week fetched successfully",
      timeRange: timeRange,
    });
  } catch (error) {
    console.error("Error fetching time range for week:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time range for week",
    });
  }
});

router.get("/week/previous", (req, res, next) => {
  const { date } = req.query;
  console.log("Received query parameter for week:", { date });
  try {
    const converted = new Date(date);

    const timeRange = getPreviousTimeRange(getTimeRange(converted).endDate);
    console.log("Fetched time range for week:", timeRange);
    res.status(200).json({
      message: "Time range for week fetched successfully",
      timeRange: timeRange,
    });
  } catch (error) {
    console.error("Error fetching time range for week:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time range for week",
    });
  }
});

router.get("/month/current", (req, res, next) => {
  const { startDate, endDate } = getMonthTimeRange(new Date());

  try {
    const timeRanges = getTimeRangesFromDateRange(startDate, endDate);
    console.log("Fetched time ranges for month:", timeRanges);
    res.status(200).json({
      message: "Time ranges for month fetched successfully",
      timeRanges: timeRanges,
    });
  } catch (error) {
    console.error("Error fetching time ranges for month:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time ranges for month",
    });
  }
});

router.get("/month/next", (req, res, next) => {
  const { date } = req.query;
  const nextMonthDate = new Date(date);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const { startDate, endDate } = getMonthTimeRange(nextMonthDate);

  try {
    const timeRanges = getTimeRangesFromDateRange(startDate, endDate);
    console.log("Fetched time ranges for month:", timeRanges);
    res.status(200).json({
      message: "Time ranges for month fetched successfully",
      timeRanges: timeRanges,
    });
  } catch (error) {
    console.error("Error fetching time ranges for month:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time ranges for month",
    });
  }
});

router.get("/month/previous", (req, res, next) => {
  const { date } = req.query;
  const previousMonthRange = new Date(date);
  previousMonthRange.setMonth(previousMonthRange.getMonth() - 1);
  const { startDate, endDate } = getMonthTimeRange(previousMonthRange);

  try {
    const timeRanges = getTimeRangesFromDateRange(startDate, endDate);
    console.log("Fetched time ranges for month:", timeRanges);
    res.status(200).json({
      message: "Time ranges for month fetched successfully",
      timeRanges: timeRanges,
    });
  } catch (error) {
    console.error("Error fetching time ranges for month:", error);
    return res.status(400).json({
      message: error.message || "Error fetching time ranges for month",
    });
  }
});

module.exports = router;
