import React from "react";

import dayjs from "dayjs";

import DateScroller from "./DateScroller";
import EventCard, { EventCardProps } from "./EventCard";

interface EventCardsProps {
  events: EventCardProps["event"][];
}

const EventCards: React.FC<EventCardsProps> = ({ events }) => {
  const today = dayjs().startOf("day");

  const todayEvents = events.filter((event) =>
    dayjs(event.date.start).isSame(today, "day")
  );

  const groupedEvents = events.reduce(
    (acc: Record<string, EventCardProps["event"][]>, event) => {
      if (todayEvents.includes(event)) return acc;
      const month = dayjs(event.date.start).format("MMMM YYYY");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(event);
      return acc;
    },
    {}
  );

  return (
    <>
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {todayEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}

      {Object.entries(groupedEvents).map(([month, events]) => (
        <div key={month}>
          <DateScroller date={events[0].date.start} />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default EventCards;
