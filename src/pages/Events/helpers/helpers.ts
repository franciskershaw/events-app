import dayjs from "dayjs";

import { BaseEvent, Event } from "../../../types/globalTypes";
import { EventFormValues } from "../hooks/useEventForm";

export const transformEventFormValues = (values: EventFormValues) => ({
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
});

interface GroupedEvents {
  [key: string]: BaseEvent[];
}

export const filterTodayEvents = (events: BaseEvent[]): BaseEvent[] => {
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

export const groupEvents = (events: BaseEvent[]): GroupedEvents => {
  return events.reduce((acc: GroupedEvents, event) => {
    const month = dayjs(event.date.start).format("MMMM YYYY");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month] = [...acc[month], event];
    return acc;
  }, {});
};

export const isEventTypeguard = (obj: unknown): obj is Event => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const eventObj = obj as Record<string, unknown>;
  return (
    typeof eventObj._id === "string" &&
    typeof eventObj.title === "string" &&
    typeof eventObj.category === "object" &&
    eventObj.category !== null &&
    "_id" in eventObj.category &&
    typeof eventObj.unConfirmed === "boolean"
  );
};

// Desktop
export const generateMonthColumns = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate).startOf("month");
  const end = dayjs(endDate).startOf("month");
  const months = [];

  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    months.push(current);
    current = current.add(1, "month");
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
