import { useMemo } from "react";

import dayjs from "dayjs";

import { useActiveDay } from "@/contexts/ActiveDay/ActiveDayContext";
import { formatTime } from "@/lib/utils";
import { UserEventInitials } from "@/pages/Events/components/global/UserEventInitials/UserEventInitials";
import { Event } from "@/types/globalTypes";

import { AddEventButton } from "../AddEventButton/AddEventButton";
import { EmptyStateNoEvents } from "../EmptyStateNoEvents/EmptyStateNoEvents";
import EventCard from "../EventCard/EventCard";

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
    <>
      {Object.keys(eventsByDay).length > 0 && (
        <div className="date-header gap-0 m-2 mb-0 z-40">
          <h2 className="text-lg font-semibold">
            {activeDay.format("dddd Do MMMM")}
          </h2>
        </div>
      )}
      <div className="p-2 pt-0">
        {/* Events - today */}
        {Object.keys(eventsByDay).length === 0 ? (
          <EmptyStateNoEvents />
        ) : (
          <>
            {events.length > 0 ? (
              <>
                <ul className="[&>*:first-child]:border-t">
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
                        className="text-sm text-muted-foreground"
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
    </>
  );
};
