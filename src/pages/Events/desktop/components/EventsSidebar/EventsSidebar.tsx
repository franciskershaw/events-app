import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { formatDate, formatTime } from "../../../../../lib/utils";
import { Event } from "../../../../../types/globalTypes";

const AddEventButton = () => {
  const { openEventModal } = useModals();
  const { activeDay } = useActiveDay();

  return (
    <button
      className="text-blue-500 hover:underline mt-2 w-full"
      onClick={() =>
        openEventModal(
          {
            _id: "",
            title: "",
            date: { start: activeDay?.toISOString() ?? "", end: "" },
            category: { _id: "", name: "", icon: "" },
            createdBy: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            unConfirmed: false,
          },
          "addFromFreeEvent"
        )
      }
    >
      Add event +
    </button>
  );
};

export const EventsSidebar = ({
  eventsByDay,
}: {
  eventsByDay: Record<string, Event[]>;
}) => {
  const { activeDay } = useActiveDay();
  const dateKey = activeDay?.format("YYYY-MM-DD");
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

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
            <>
              <ul>
                {events.map((event) => {
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
                      {event.description && (
                        <div className="text-xs text-gray-500 italic mt-1">
                          {event.description}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <AddEventButton />
            </>
          ) : (
            <>
              <p className="text-center">No events on this day.</p>
              <AddEventButton />
            </>
          )}
        </div>
        {/* Search functionality */}
      </SidebarContent>
    </Sidebar>
  );
};
