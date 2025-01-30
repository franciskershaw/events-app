import {
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { ActiveDayProvider } from "../../../contexts/ActiveDay/ActiveDayContext";
import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { Event } from "../../../types/globalTypes";
import {
  generateMonthColumns,
  getEventsByDay,
  isEventTypeguard,
} from "../helpers/helpers";
import { EventsSidebar } from "./components/EventsSidebar/EventsSidebar";
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

  const showLocations = true;
  const defaultLocation = "Bristol";

  const eventsByDay: Record<string, Event[]> = getEventsByDay(events);
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  console.log("EventsDesktop eventsByDay", eventsByDay);

  return (
    <ActiveDayProvider>
      <SidebarProvider>
        <EventsSidebar eventsByDay={eventsByDay} />
        <SidebarTrigger />
        <div
          className="grid gap-4 overflow-x-auto h-screen pl-4"
          style={{
            gridTemplateColumns: `repeat(${monthColumns.length}, 300px)`,
          }}
        >
          {monthColumns.map((month) => (
            <MonthColumn
              key={month.format("MMMM YYYY")}
              month={month}
              eventsByDay={eventsByDay}
              showLocations={showLocations}
              defaultLocation={defaultLocation}
            />
          ))}
        </div>
      </SidebarProvider>
    </ActiveDayProvider>
  );
};
