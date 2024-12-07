import React from "react";

import dayjs from "dayjs";

import DateScroller from "./DateScroller";
import EventCard, { EventCardProps } from "./EventCard";

interface EventCardsProps {
  events: EventCardProps["event"][];
}

const EventCards: React.FC<EventCardsProps> = ({ events }) => {
  const today = dayjs().startOf("day");

  // Filter events occurring today
  const todayEvents = events.filter((event) =>
    dayjs(event.date.start).isSame(today, "day")
  );

  // Group remaining events by month
  const groupedEvents = events.reduce(
    (acc: Record<string, EventCardProps["event"][]>, event) => {
      if (todayEvents.includes(event)) return acc; // Skip today's events from grouping
      const month = dayjs(event.date.start).format("MMMM YYYY");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(event);
      return acc;
    },
    {}
  );

  // const getDaysWithEvents = (
  //   month: string,
  //   events: EventCardProps["event"][]
  // ) => {
  //   const monthStart = dayjs(events[0].date.start).startOf("month");
  //   const monthEnd = dayjs(events[0].date.start).endOf("month");

  //   const allDays = [];
  //   let currentDay = monthStart;

  //   while (currentDay.isSameOrBefore(monthEnd, "day")) {
  //     const eventForDay = events.find((event) =>
  //       dayjs(event.date.start).isSame(currentDay, "day")
  //     );

  //     allDays.push({
  //       date: currentDay.toISOString(),
  //       event: eventForDay || null,
  //     });

  //     currentDay = currentDay.add(1, "day");
  //   }

  //   return allDays;
  // };

  return (
    <>
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2">
            {todayEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* {Object.entries(groupedEvents).map(([month, events]) => (
        <div key={month}>
          <DateScroller date={events[0].date.start} />
          <div className="space-y-2">
            {getDaysWithEvents(month, events).map(({ date, event }) =>
              event ? (
                <EventCard key={event._id} event={event} />
              ) : (
                <EventCardEmpty key={date} date={date} />
              )
            )}
          </div>
        </div>
      ))} */}

      {Object.entries(groupedEvents).map(([month, events]) => (
        <div key={month}>
          <DateScroller date={events[0].date.start} />
          <div className="space-y-2">
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
