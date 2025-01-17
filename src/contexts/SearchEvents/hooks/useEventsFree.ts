import { useMemo } from "react";

import { eachDayOfInterval, isSameDay } from "date-fns";

import { Event, EventFree } from "../../../types/globalTypes";
import { splitQueryParts } from "../helpers";

interface UseEventsFreeProps {
  eventsDb: Event[];
  startDate: Date | null;
  endDate: Date | null;
  query: string;
}

export const useEventsFree = ({
  eventsDb,
  startDate,
  endDate,
  query,
}: UseEventsFreeProps): EventFree[] => {
  return useMemo(() => {
    const today = new Date();

    const furthestEventDate = eventsDb.reduce(
      (latest, event) =>
        new Date(event.date.end || event.date.start) > latest
          ? new Date(event.date.end || event.date.start)
          : latest,
      today
    );

    const { dateQuery } = splitQueryParts(query);
    const queryEndDate = dateQuery.end ? new Date(dateQuery.end) : null;

    const furthestDate =
      queryEndDate && queryEndDate > furthestEventDate
        ? queryEndDate
        : furthestEventDate;

    const rangeEndDate =
      endDate && endDate > furthestDate ? endDate : furthestDate;

    const allDays = eachDayOfInterval({ start: today, end: rangeEndDate });

    const eventDays = eventsDb.flatMap((event) => {
      const eventStart = new Date(event.date.start);
      const eventEnd = new Date(event.date.end || event.date.start);
      return eachDayOfInterval({ start: eventStart, end: eventEnd });
    });

    let eventFreeDays = allDays.filter(
      (day) => !eventDays.some((eventDay) => isSameDay(day, eventDay))
    );

    if (startDate) {
      eventFreeDays = eventFreeDays.filter((day) => day >= startDate);
    }

    return eventFreeDays.map((day) => ({
      _id: `free-${day.toISOString()}`,
      date: { start: day.toISOString(), end: day.toISOString() },
    }));
  }, [eventsDb, startDate, endDate, query]);
};
