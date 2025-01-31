import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { formatDate, formatTime } from "../../../../../lib/utils";
import { Event } from "../../../../../types/globalTypes";

export const EventsSidebar = ({
  eventsByDay,
}: {
  eventsByDay: Record<string, Event[]>;
}) => {
  const { activeDay } = useActiveDay();
  const dateKey = activeDay?.format("YYYY-MM-DD");
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

  console.log(
    "activeDay",
    activeDay && eventsByDay[activeDay?.format("YYYY-MM-DD")]
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="border border-gray-300 bg-white rounded text-center p-2 m-2 mb-0 sticky top-2 z-10 shadow outline outline-8 outline-white/75">
          {activeDay ? (
            <h2 className="text-lg font-semibold">
              {activeDay.format("dddd Do MMMM")}
            </h2>
          ) : (
            <h2 className="text-lg font-semibold">Select a day</h2>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          {/* Active day summary - ability to confirm/edit/delete, coming up summary */}
          {events.length > 0 ? (
            <ul>
              {events.map((event) => {
                console.log("event formatTime", formatTime(event.date));
                console.log("event formatDate", formatDate(event.date));

                return (
                  <li key={event._id} className="border-b p-2">
                    {formatTime(event.date) && (
                      <span>{formatTime(event.date)}: </span>
                    )}
                    {/* TODO: Go through category icons and map to React icon elements */}
                    {/* <span>{event.category.icon}</span> */}
                    <span>{event.title}</span>
                    {event.unConfirmed && <span>(?)</span>}

                    <div className="text-xs text-gray-500">
                      {formatDate(event.date) && (
                        <span>{formatDate(event.date)} | </span>
                      )}
                      <span>{event.category.name}</span>
                      {event.location?.venue && (
                        <span> | {event.location?.venue}</span>
                      )}
                      {event.location?.venue && (
                        <span> | {event.location?.city}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No events on this day.</p>
          )}
        </div>

        {/* Click on free day - add event in */}
        {/* Search functionality */}
      </SidebarContent>
    </Sidebar>
  );
};
