import { useMemo } from "react";

import dayjs from "dayjs";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { formatTime } from "../../../../../lib/utils";
import { Event } from "../../../../../types/globalTypes";
import { UserEventInitials } from "../../../components/UserEventInitials/UserEventInitials";
import { EmptyState } from "../EmptyState/EmptyState";
import EventCard from "../EventCard/EventCard";

const AddEventButton = () => {
  const { openEventModal } = useModals();
  const { activeDay } = useActiveDay();

  return (
    <button
      className="text-blue-500 hover:underline my-4 w-full"
      onClick={() =>
        openEventModal(
          {
            _id: "",
            title: "",
            date: { start: activeDay?.toISOString() ?? "", end: "" },
            category: { _id: "", name: "", icon: "" },
            createdBy: { _id: "", name: "" },
            createdAt: new Date(),
            updatedAt: new Date(),
            unConfirmed: false,
            private: false,
          },
          "addFromFreeEvent"
        )
      }
    >
      Add event +
    </button>
  );
};

export const EventsSummary = ({
  eventsByDay,
}: {
  eventsByDay: Record<string, Event[]>;
}) => {
  const { activeDay } = useActiveDay();

  // Events - today
  const dateKey = activeDay?.format("YYYY-MM-DD");
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

  // Events - next 7 days
  const nextWeek = activeDay.add(8, "days");
  const upcomingEvents = useMemo(() => {
    return Object.entries(eventsByDay)
      .filter(([date]) => {
        const eventDate = dayjs(date);
        return (
          eventDate.isAfter(activeDay, "day") &&
          eventDate.isBefore(nextWeek, "day")
        );
      })
      .sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
      .map(([date, events]) => ({ date, events }));
  }, [eventsByDay, activeDay, nextWeek]);

  return (
    <Sidebar>
      {Object.keys(eventsByDay).length > 0 && (
        <SidebarHeader>
          <div className="date-header m-2 mb-0">
            <h2 className="text-lg font-semibold">
              {activeDay.format("dddd Do MMMM")}
            </h2>
          </div>
        </SidebarHeader>
      )}
      <SidebarContent>
        <div className="p-2">
          {/* Events - today */}
          {Object.keys(eventsByDay).length === 0 ? (
            <EmptyState />
          ) : (
            <>
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
                <div className="px-2">
                  <p className="text-center mt-4">No events on this day.</p>
                  <AddEventButton />
                </div>
              )}
            </>
          )}

          {/* Events - next 7 days */}
          {upcomingEvents.length > 0 && (
            <div className="p-2 border-t">
              <h3 className="text-md font-semibold mb-2">Coming Up</h3>
              <ul>
                {upcomingEvents.map(({ date, events }) => (
                  <li key={date} className="mb-4">
                    <h4 className="text-sm font-medium">
                      {dayjs(date).format("dddd Do MMMM")}
                    </h4>
                    <ol>
                      {events.map((event) => (
                        <li
                          key={event._id}
                          className="text-sm text-gray-500 list-disc list-outside ml-4"
                        >
                          <div className="flex gap-1 items-center">
                            <UserEventInitials event={event} />
                            <span>
                              {formatTime(event.date) &&
                                `${formatTime(event.date)}: `}
                              {event.title}
                              {event.unConfirmed && "(?)"}
                              {event.location?.venue &&
                                ` @ ${event.location?.venue}`}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Search functionality */}
      </SidebarContent>
    </Sidebar>
  );
};
