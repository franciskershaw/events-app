import { Event } from "../../../types/globalTypes";

export const getFirstAndLastEventDates = (events: Event[]) => {
  const firstEventDate = new Date(
    Math.min(...events.map((event) => new Date(event.date.start).getTime()))
  );
  const lastEventDate = new Date(
    Math.max(...events.map((event) => new Date(event.date.start).getTime()))
  );

  return [firstEventDate, lastEventDate];
};
