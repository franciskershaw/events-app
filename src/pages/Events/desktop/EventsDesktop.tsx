import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { LOCATION_DEFAULT, LOCATION_SHOW } from "../../../constants/app";
import { ActiveDayProvider } from "../../../contexts/ActiveDay/ActiveDayContext";
import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { useSidebarContent } from "../../../contexts/Sidebar/desktop/SidebarContentContext";
import { Event } from "../../../types/globalTypes";
import { generateMonthColumns, getEventsByDay } from "../helpers/helpers";
import { EventsSearch } from "./components/EventsSearch/EventsSearch";
import { EventsSummary } from "./components/EventsSummary/EventsSummary";
import { MonthColumn } from "./components/MonthColumn/MonthColumn";

export const EventsDesktop = () => {
  const { filteredEvents } = useSearch();
  const { sidebarContent } = useSidebarContent();

  const firstEventDate = new Date(
    Math.min(
      ...filteredEvents.map((event) => new Date(event.date.start).getTime())
    )
  );
  const lastEventDate = new Date(
    Math.max(
      ...filteredEvents.map((event) => new Date(event.date.start).getTime())
    )
  );

  const eventsByDay: Record<string, Event[]> = getEventsByDay(filteredEvents);
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  return (
    <ActiveDayProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            {sidebarContent === "events" ? (
              <EventsSummary eventsByDay={eventsByDay} />
            ) : (
              <EventsSearch />
            )}
          </SidebarContent>
          <SidebarTrigger />
        </Sidebar>

        <div
          className="grid gap-4 h-screen pl-12"
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
      </SidebarProvider>
    </ActiveDayProvider>
  );
};
