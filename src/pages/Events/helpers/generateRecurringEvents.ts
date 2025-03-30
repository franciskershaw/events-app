import dayjs from "dayjs";

import { MIN_VISIBLE_MONTHS } from "../../../constants/app";
import { Event } from "../../../types/globalTypes";

export const generateRecurringEvents = (
  event: Event,
  lastEventDate: Date
): Event[] => {
  if (!event.recurrence?.isRecurring || !event.recurrence.pattern) {
    return [event];
  }

  const { frequency, interval, endDate } = event.recurrence.pattern;
  const instances: Event[] = [event]; // Start with the base event
  let currentDate = dayjs(event.date.start); // Start from the base event's start date

  const minVisibleDate = dayjs()
    .add(MIN_VISIBLE_MONTHS, "month")
    .endOf("month");

  // Determine the end date for recurrence generation
  const recurrenceEndDate = dayjs(lastEventDate).isAfter(minVisibleDate)
    ? lastEventDate
    : minVisibleDate.toDate();

  // Calculate the difference between currentDate and recurrenceEndDate
  const diffInDays = dayjs(recurrenceEndDate).diff(currentDate, "day");
  const diffInWeeks = dayjs(recurrenceEndDate).diff(currentDate, "week");
  const diffInMonths = dayjs(recurrenceEndDate).diff(currentDate, "month");
  const diffInYears = dayjs(recurrenceEndDate).diff(currentDate, "year");

  // Determine the maximum number of instances based on the frequency
  let maxInstances: number;
  switch (frequency) {
    case "daily":
      maxInstances = Math.floor(diffInDays / interval);
      break;
    case "weekly":
      maxInstances = Math.floor(diffInWeeks / interval);
      break;
    case "monthly":
      maxInstances = Math.floor(diffInMonths / interval);
      break;
    case "yearly":
      maxInstances = Math.floor(diffInYears / interval);
      break;
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }

  // Generate instances up to the maximum number or until count/endDate is reached
  for (let i = 0; i < maxInstances; i++) {
    switch (frequency) {
      case "daily":
        currentDate = currentDate.add(interval, "day");
        break;
      case "weekly":
        currentDate = currentDate.add(interval, "week");
        break;
      case "monthly":
        currentDate = currentDate.add(interval, "month");
        break;
      case "yearly":
        currentDate = currentDate.add(interval, "year");
        break;
    }

    if (endDate && currentDate.isAfter(endDate)) {
      break;
    }

    // Clone the base event and update the date
    const newInstance = { ...event };
    newInstance.date = {
      start: currentDate.toISOString(),
      end: currentDate
        .add(dayjs(event.date.end).diff(dayjs(event.date.start)), "millisecond")
        .toISOString(),
    };

    instances.push(newInstance);
  }

  return instances;
};
