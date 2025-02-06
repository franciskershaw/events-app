import { useMemo } from "react";

import { eachDayOfInterval, isSameDay } from "date-fns";

import {
  CATEGORY_HOLIDAY,
  CATEGORY_REMINDER,
  LOCATION_DEFAULT,
} from "../../../constants/app";
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

    const holidayLocations = new Map<string, string>();

    eventsDb
      .filter((event) => event.category.name === CATEGORY_HOLIDAY)
      .forEach((event) => {
        const eventDays = eachDayOfInterval({
          start: new Date(event.date.start),
          end: new Date(event.date.end || event.date.start),
        });

        eventDays.forEach((day) => {
          const dayKey = day.toISOString().split("T")[0];
          holidayLocations.set(
            dayKey,
            event.location?.city || LOCATION_DEFAULT
          );
        });
      });

    const eventDays = eventsDb
      .filter(
        (event) =>
          ![CATEGORY_HOLIDAY, CATEGORY_REMINDER].includes(event.category.name)
      )
      .flatMap((event) => {
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

    return eventFreeDays.map((day) => {
      const dayKey = day.toISOString().split("T")[0];
      const locationCity = holidayLocations.get(dayKey) || LOCATION_DEFAULT;

      return {
        _id: `free-${day.toISOString()}`,
        date: { start: day.toISOString(), end: day.toISOString() },
        location: { city: locationCity },
      };
    });
  }, [eventsDb, startDate, endDate, query]);
};
