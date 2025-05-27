
const timeFrameLength = 7; // 7 days in a week

  const getWrapperTimeFrame = (date)=> {
    const startDate = getTheStartOfWeek(date);
    const endDate = getTheEndOfWeek(date);
    const weekNumber = getWeekNumber(startDate);
    return {
      index: weekNumber,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      unscheduledTasks: [],
      taskQueues: [],
    };
  }
  function isMonday(date) {
    return date.getDay() === 1;
  }

  function getTheStartOfWeek(date) {
    if (isMonday(date)) {
      return date;
    }
    // If the date is not a Monday, find the previous Monday
    const day = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Sunday (0) to be the last day of the week

    const startOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - day
    );
    return startOfWeek;
  }

  function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    while (startOfYear.getDay() !== 1) {
      startOfYear.setDate(startOfYear.getDate() + 1);
    }
    // Calculate the number of days between the start of the year and the given date
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    // Calculate the week number
    const weekNumber = Math.floor(days / 7) + 1;
    return weekNumber;
  }

  function getTheEndOfWeek(date) {
    const startOfTheWeek = getTheStartOfWeek(date);
    return new Date(startOfTheWeek.getFullYear(), startOfTheWeek.getMonth(), startOfTheWeek.getDate() + 6);
  }

  const getTimeFramesFromDateRange = (startDate, endDate)=> {
    console.log("Start date:", startDate);
    console.log("End date:", endDate);
    const timeFrames = [];
    let timeFrame = getWrapperTimeFrame(startDate);
    const currentDate = new Date(timeFrame.endDate);
    console.log("Time frame:", timeFrame);
    timeFrames.push(timeFrame);
    while (!(currentDate > endDate)) {
        currentDate.setDate(currentDate.getDate() + 7);
        timeFrames.push(getWrapperTimeFrame(currentDate));
    }
    return timeFrames;
  }

  const getNextTimeFrame = (baseDate)=> {
    timeFromNextFrame = new Date(baseDate);
    timeFromNextFrame.setDate(timeFromNextFrame.getDate() + timeFrameLength); // Move to the next week
    const nextTimeFrame = getWrapperTimeFrame(timeFromNextFrame);
    return nextTimeFrame;
  }

  const getPreviousTimeFrame = (baseDate)=> {
    timeFromPreviousFrame = new Date(baseDate);
    timeFromPreviousFrame.setDate(timeFromPreviousFrame.getDate() - timeFrameLength); // Move to the previous week
    const previousTimeFrame = getWrapperTimeFrame(timeFromPreviousFrame);
    return previousTimeFrame;
  }

  module.exports = { getWrapperTimeFrame, getTimeFramesFromDateRange, getNextTimeFrame, getPreviousTimeFrame };
  