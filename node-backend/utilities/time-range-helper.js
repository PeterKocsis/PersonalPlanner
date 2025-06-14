const timeRangeLength = 7; // 7 days in a week

function convertToDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date;
}

function checkDateRange(startDate, endDate) {
  return startDate > endDate ? false : true;
}

const getTimeRange = (date) => {
  const startDate = getTimeRangeStart(date);
  const endDate = getTimeRangeEnd(date);
  const timeRangeIndex = getTimeRangeIndex(startDate);
  return {
    year: date.getFullYear(),
    index: timeRangeIndex,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };
};
function isMonday(date) {
  return date.getDay() === 1;
}

function getTimeRangeStart(date) {
  if (isMonday(date)) {
    return date;
  }
  // If the date is not a Monday, find the previous Monday
  const day = date.getDay() === 0 ? timeRangeLength - 1 : date.getDay() - 1; // Adjust for Sunday (0) to be the last day of the week

  const rangeStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - day
  );
  return rangeStart;
}
/**
 *
 * @param {Date} date the target date to find an index
 * @returns The index of time frame for the target date, where the one index means the first time frame which starts in the given year.
 */
function getTimeRangeIndex(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  while (startOfYear.getDay() !== 1) {
    startOfYear.setDate(startOfYear.getDate() + 1);
  }
  // Calculate the number of days between the start of the year and the given date
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  // Calculate the week number
  const rangeIndexInYear = Math.round(days / 7) + 1;
  return rangeIndexInYear;
}

function getTimeRangeEnd(date) {
  const startOfTimeRange = getTimeRangeStart(date);
  const endOfTimeRange = new Date(startOfTimeRange);
  endOfTimeRange.setDate(endOfTimeRange.getDate() + 6);
  return endOfTimeRange;
}

const getTimeRangeByIndex = (year, index) => {
  if (!year || !index) {
    throw new Error("Year and index are required to get a time range");
  }
  const startDate = new Date(year, 0, 1);
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() + 1);
  }
  startDate.setDate(startDate.getDate() + (index - 1) * timeRangeLength);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + timeRangeLength - 1);
  return {
    index: index,
    startDate: startDate,
    endDate: endDate,
    year: year
  };
};

const getTimeRangesFromDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    const initialRange = getTimeRange(new Date());
    return getTimeRangesFromDateRange(
      initialRange.startDate,
      initialRange.endDate
    );
  }
  const start = convertToDate(startDate);
  const end = convertToDate(endDate);
  if (!checkDateRange(start, end)) {
    throw new Error("startDate must be earlier than endDate");
  }
  let timeRangeInstance = getTimeRange(start);
  const timeRanges = [];
  const rangeEnd = new Date(timeRangeInstance.endDate);
  console.log("Time frame:", timeRangeInstance);
  timeRanges.push(timeRangeInstance);
  while (!(rangeEnd > end)) {
    rangeEnd.setDate(rangeEnd.getDate() + 7);
    timeRanges.push(getTimeRange(rangeEnd));
  }
  return timeRanges;
};

const getMonthTimeRange = (date) => {
  const startDate = new Date(date);
  startDate.setDate(1); // Set to the first day of the month
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
  endDate.setDate(0); // Set to the last day of the month
  return {
    startDate,
    endDate,
  };
}

const getNextTimeRange = (dateFromCurrentRange) => {
  const currentRange = getTimeRange(dateFromCurrentRange);
  timeFromNextFrame = new Date(currentRange.endDate);
  timeFromNextFrame.setDate(timeFromNextFrame.getDate() + timeRangeLength); // Move to the next week
  const nextTimeFrame = getTimeRange(timeFromNextFrame);
  return nextTimeFrame;
};

const getPreviousTimeRange = (dateFromCurrentRange) => {
  const timeRange = getTimeRange(dateFromCurrentRange);
  timeFromPreviousFrame = new Date(timeRange.startDate);
  timeFromPreviousFrame.setDate(
    timeFromPreviousFrame.getDate() - timeRangeLength
  ); // Move to the previous week
  const previousTimeFrame = getTimeRange(timeFromPreviousFrame);
  return previousTimeFrame;
};

module.exports = {
  getTimeRangesFromDateRange,
  getNextTimeRange,
  getPreviousTimeRange,
  getTimeRangeByIndex,
  getTimeRange,
  getMonthTimeRange
};
