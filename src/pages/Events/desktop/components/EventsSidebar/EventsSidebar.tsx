import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { Event } from "../../../../../types/globalTypes";
import EventCard from "../EventCard/EventCard";

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
        <div className="date-header m-2 mb-0">
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
          {events.length > 0 ? (
            <>
              <ul>
                {events.map((event) => (
                  <EventCard event={event} key={event._id} />
                ))}
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
