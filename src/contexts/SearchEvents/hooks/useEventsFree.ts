import { useMemo } from "react";

import { eachDayOfInterval } from "date-fns";
import dayjs from "dayjs";

import {
  CATEGORY_ANNIVERSARY,
  CATEGORY_BIRTHDAY,
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
    const today = dayjs().toDate();

    const furthestEventDate = events.reduce(
      (latest, event) =>
        dayjs(event.date.end || event.date.start).toDate() > latest
          ? dayjs(event.date.end || event.date.start).toDate()
          : latest,
      today
    );

    const { dateQuery } = splitQueryParts(query);
    const queryEndDate = dateQuery.end ? dayjs(dateQuery.end).toDate() : null;

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
        start: dayjs(event.date.start).toDate(),
        end: dayjs(event.date.end || event.date.start).toDate(),
      }).forEach((day) => {
        holidayLocations.set(
          day.toUTCString().split("T")[0],
          event.location?.city || LOCATION_DEFAULT
        );
      });
    });

    const eventDays = new Set<string>();
    events.forEach((event) => {
      if (
        [
          CATEGORY_ANNIVERSARY,
          CATEGORY_BIRTHDAY,
          CATEGORY_HOLIDAY,
          CATEGORY_REMINDER,
        ].includes(event.category.name)
      )
        return;

      eachDayOfInterval({
        start: dayjs(event.date.start).toDate(),
        end: dayjs(event.date.end || event.date.start).toDate(),
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
        createdAt: dayjs(day).toDate(),
        updatedAt: dayjs(day).toDate(),
        unConfirmed: false,
        private: false,
      };
    });
  }, [events, startDate, endDate, query]);
};
