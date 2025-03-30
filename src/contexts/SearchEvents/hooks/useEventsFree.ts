import { useMemo } from "react";

import { eachDayOfInterval } from "date-fns";

import {
  CATEGORY_FREE,
  CATEGORY_HOLIDAY,
  CATEGORY_REMINDER,
  LOCATION_DEFAULT,
} from "../../../constants/app";
import { Event } from "../../../types/globalTypes";
import { splitQueryParts } from "../helpers";

interface UseEventsFreeProps {
  events: Event[];
  startDate: Date | null;
  endDate: Date | null;
  query: string;
}

export const useEventsFree = ({
  events,
  startDate,
  endDate,
  query,
}: UseEventsFreeProps): Event[] => {
  return useMemo(() => {
    const today = new Date();

    const furthestEventDate = events.reduce(
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
    events.forEach((event) => {
      if (event.category.name !== CATEGORY_HOLIDAY) return;

      eachDayOfInterval({
        start: new Date(event.date.start),
        end: new Date(event.date.end || event.date.start),
      }).forEach((day) => {
        holidayLocations.set(
          day.toUTCString().split("T")[0],
          event.location?.city || LOCATION_DEFAULT
        );
      });
    });

    const eventDays = new Set<string>();
    events.forEach((event) => {
      if ([CATEGORY_HOLIDAY, CATEGORY_REMINDER].includes(event.category.name))
        return;

      eachDayOfInterval({
        start: new Date(event.date.start),
        end: new Date(event.date.end || event.date.start),
      }).forEach((day) => eventDays.add(day.toUTCString().split("T")[0]));
    });

    let eventFreeDays = allDays.filter(
      (day) => !eventDays.has(day.toUTCString().split("T")[0])
    );

    if (startDate) {
      eventFreeDays = eventFreeDays.filter((day) => day >= startDate);
    }

    return eventFreeDays.map((day) => {
      const dayKey = day.toUTCString().split("T")[0];
      const locationCity = holidayLocations.get(dayKey) || LOCATION_DEFAULT;

      console.log(day, dayKey);

      return {
        _id: `free-${day.toUTCString()}`,
        title: "",
        date: { start: day.toUTCString(), end: day.toUTCString() },
        location: { city: locationCity, venue: "" },
        category: {
          _id: CATEGORY_FREE,
          name: CATEGORY_FREE,
          icon: "",
        },
        additionalAttributes: {},
        createdBy: {
          _id: "",
          name: "",
        },
        description: "",
        createdAt: new Date(day),
        updatedAt: new Date(day),
        unConfirmed: false,
        private: false,
      };
    });
  }, [events, startDate, endDate, query]);
};
