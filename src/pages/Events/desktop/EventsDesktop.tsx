import { LOCATION_DEFAULT, LOCATION_SHOW } from "../../../constants/app";
import { ActiveDayProvider } from "../../../contexts/ActiveDay/ActiveDayContext";
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

  const firstEventDate = new Date(
    Math.min(...events.map((event) => new Date(event.date.start).getTime()))
  );
  const lastEventDate = new Date(
    Math.max(...events.map((event) => new Date(event.date.start).getTime()))
  );

  const eventsByDay: Record<string, Event[]> = getEventsByDay(events);
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  return (
    <ActiveDayProvider>
      <div
        className="grid gap-4 h-screen pl-8"
        style={{
          gridTemplateColumns: `repeat(${monthColumns.length}, 300px)`,
        }}
      >
        {monthColumns.map((month) => (
          <MonthColumn
            key={month.format("MMMM YYYY")}
            month={month}
            eventsByDay={eventsByDay}
            showLocations={LOCATION_SHOW}
            defaultLocation={LOCATION_DEFAULT}
          />
        ))}
      </div>
    </ActiveDayProvider>
  );
};
