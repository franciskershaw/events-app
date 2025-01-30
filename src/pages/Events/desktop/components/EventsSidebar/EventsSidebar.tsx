import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { Event } from "../../../../../types/globalTypes";

export const EventsSidebar = ({
  eventsByDay,
}: {
  eventsByDay: Record<string, Event[]>;
}) => {
  const { activeDay } = useActiveDay();
  const dateKey = activeDay?.format("YYYY-MM-DD");
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

  console.log("EventsSidebar events", events);

  return (
    <Sidebar>
      <SidebarHeader>
        {activeDay ? (
          <h2 className="text-lg font-semibold">
            {activeDay.format("dddd, MMM D")}
          </h2>
        ) : (
          <h2 className="text-lg font-semibold">Select a day</h2>
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* Active day summary - ability to confirm/edit/delete, coming up summary */}
        {events.length > 0 ? (
          <ul className="list-disc pl-5">
            {events.map((event) => (
              <li key={event._id} className="text-sm">
                {event.title}{" "}
                {event.unConfirmed && <span className="text-red-500">?</span>}
                <div className="text-xs text-gray-500">
                  {event.location?.city}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No events on this day.</p>
        )}
        {/* Click on free day - add event in */}
        {/* Search functionality */}
      </SidebarContent>
    </Sidebar>
  );
};
