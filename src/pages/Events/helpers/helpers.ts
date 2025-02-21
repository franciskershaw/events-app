import { format } from "date-fns";
import dayjs from "dayjs";

import { CATEGORY_FREE } from "../../../constants/app";
import { Event } from "../../../types/globalTypes";
import { EventFormValues } from "../hooks/useEventForm";

export const transformEventFormValues = (
  values: EventFormValues & { copiedFrom?: string }
) => ({
  title: values.title,
  date: {
    start: values.datetime,
    end: values.endDatetime || values.datetime,
  },
  location: {
    venue: values.venue,
    city: values.city,
  },
  description: values.description,
  category: values.category,
  unConfirmed: values.unConfirmed,
  copiedFrom: values.copiedFrom,
});

interface GroupedEvents {
  [key: string]: Event[];
}

export const filterTodayEvents = (events: Event[]) => {
  const today = dayjs().startOf("day");
  return events.filter((event) => {
    const startDate = dayjs(event.date.start);
    const endDate = dayjs(event.date.end);
    return (
      startDate.isSame(today, "day") ||
      endDate.isSame(today, "day") ||
      (startDate.isBefore(today, "day") && endDate.isAfter(today, "day"))
    );
  });
};

// Group events by month and remove free days from days where there is already an event
export const groupEvents = (events: Event[]): GroupedEvents => {
  const grouped = events.reduce((acc: GroupedEvents, event) => {
    const month = dayjs(event.date.start).format("MMMM YYYY");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month] = [...acc[month], event];
    return acc;
  }, {});

  const occupiedDates = new Set(
    events
      .filter((event) => event.category._id !== CATEGORY_FREE)
      .map((event) => event.date.start)
  );

  Object.keys(grouped).forEach((month) => {
    grouped[month] = grouped[month].filter(
      (event) =>
        event.category._id !== CATEGORY_FREE ||
        !occupiedDates.has(event.date.start)
    );
  });

  return grouped;
};

// Desktop
export const generateMonthColumns = (startDate: Date, endDate: Date) => {
  const start = isNaN(startDate.getTime())
    ? dayjs().startOf("month")
    : dayjs(startDate).startOf("month");
  const end = dayjs(endDate).startOf("month");
  const months = [];

  let current = start;
  let count = 0;

  while (current.isBefore(end) || current.isSame(end) || count < 6) {
    months.push(current);
    current = current.add(1, "month");
    count++;
  }

  return months;
};

export const getEventsByDay = (events: Event[]): Record<string, Event[]> => {
  return events.reduce(
    (acc, event) => {
      const startDate = dayjs(event.date.start);
      const endDate = dayjs(event.date.end);

      let currentDate = startDate;
      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, "day")
      ) {
        const dateKey = currentDate.format("YYYY-MM-DD");

        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(event);

        currentDate = currentDate.add(1, "day");
      }

      return acc;
    },
    {} as Record<string, Event[]>
  );
};

interface ShareEventProps {
  event: Event;
}

export const shareEvent = ({ event }: ShareEventProps) => {
  const eventTime = format(new Date(event.date.start), "h:mmaaa");
  const eventDay = format(new Date(event.date.start), "EEEE do MMM");

  let message = `I'm going to ${event.title}`;

  if (event.location?.venue) {
    message += ` at ${event.location.venue}`;
  }

  message += ` at ${eventTime} on ${eventDay}`;

  return message;
};
