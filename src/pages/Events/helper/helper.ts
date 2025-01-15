import dayjs from "dayjs";

import { BaseEvent, Event } from "@/types/globalTypes";

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

export const isEventTypeguard = (event: BaseEvent): event is Event => {
  return "title" in event && "category" in event && "sharedWith" in event;
};
