import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "../../../../components/ui/sidebar";
import { LOCATION_DEFAULT, LOCATION_SHOW } from "../../../../constants/app";
import { ActiveDayProvider } from "../../../../contexts/ActiveDay/ActiveDayContext";
import { useSearch } from "../../../../contexts/SearchEvents/SearchEventsContext";
import { useSidebarContent } from "../../../../contexts/Sidebar/desktop/SidebarContentContext";
import useUser from "../../../../hooks/user/useUser";
import { Event } from "../../../../types/globalTypes";
import { filterUserEvents } from "../../helpers/filterUserEvents";
import { generateMonthColumns } from "../../helpers/generateMonthColumns";
import { getFirstAndLastEventDates } from "../../helpers/getFirstAndLastEventDates";
import { getEventsByDay } from "../../helpers/helpers";
import useGetPastMonthEvents from "../../hooks/useGetPastMonthEvents";
import { EventsSearch } from "./EventsSearch/EventsSearch";
import { EventsSummary } from "./EventsSummary/EventsSummary";
import { MonthColumn } from "./MonthColumn/MonthColumn";

export const EventsDesktop = () => {
  const { user } = useUser();
  const { filteredEvents, activeFilterCount } = useSearch();
  const { sidebarContent } = useSidebarContent();

  const { eventsPastMonth } = useGetPastMonthEvents();
  const filteredEventsPastMonth = filterUserEvents(eventsPastMonth, user);

  const filteredEventsWithoutPast = filteredEvents.filter((event) => {
    const eventEndDate = new Date(event.date.end);
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    return eventEndDate >= firstDayOfMonth;
  });

  const { firstEventDate, lastEventDate } = getFirstAndLastEventDates(
    filteredEventsWithoutPast
  );

  const eventsByDay: Record<string, Event[]> = getEventsByDay([
    ...filteredEventsWithoutPast,
    ...(activeFilterCount === 0 ? filteredEventsPastMonth : []),
  ]);

  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  const filtersActive = activeFilterCount > 0 ? true : false;

  return (
    <ActiveDayProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            {sidebarContent === "events" ? (
              <EventsSummary eventsByDay={eventsByDay} />
            ) : (
              <EventsSearch eventsByDay={eventsByDay} filters={filtersActive} />
            )}
          </SidebarContent>
          <SidebarTrigger />
        </Sidebar>

        <div
          className="grid gap-4 h-screen pl-10"
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
              filters={filtersActive}
            />
          ))}
        </div>
      </SidebarProvider>
    </ActiveDayProvider>
  );
};
