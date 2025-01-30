import dayjs from "dayjs";

import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { Event } from "../../../types/globalTypes";
import {
  generateMonthColumns,
  getEventsByDay,
  isEventTypeguard,
} from "../helpers/helpers";
import { MonthColumn } from "./components/MonthColumn/MonthColumn";

export const EventsDesktop = () => {
  const { filteredEvents } = useSearch();

  const events = filteredEvents
    .map((event) => (isEventTypeguard(event) ? event : null))
    .filter((event): event is Event => event !== null); // Get rid of EventFree type errors
  const today = dayjs();

  const firstEventDate = new Date(
    Math.min(...events.map((event) => new Date(event.date.start).getTime()))
  );
  const lastEventDate = new Date(
    Math.max(...events.map((event) => new Date(event.date.start).getTime()))
  );

  const showLocations = true;
  const defaultLocation = "Bristol";

  const eventsByDay = getEventsByDay(events);
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  return (
    <div
      className="grid gap-4 overflow-x-auto h-screen"
      style={{ gridTemplateColumns: `repeat(${monthColumns.length}, 300px)` }}
    >
      {monthColumns.map((month) => (
        <MonthColumn
          key={month.format("MMMM YYYY")}
          month={month}
          today={today}
          eventsByDay={eventsByDay}
          showLocations={showLocations}
          defaultLocation={defaultLocation}
        />
      ))}
    </div>
  );
};
