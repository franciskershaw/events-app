import dayjs from "dayjs";

import { Event } from "../../../types/globalTypes";
import { filterTodayEvents, groupEvents } from "../helper/helper";
import DateScroller from "./DateScroller";
import EventCard from "./EventCard";

interface EventCardsProps {
  events: Event[];
}

const EventCards = ({ events }: EventCardsProps) => {
  const today = dayjs().startOf("day");

  const todayEvents = filterTodayEvents(events, today);
  const upcomingEvents = groupEvents(
    events.filter((event) => !todayEvents.includes(event))
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

      {Object.entries(upcomingEvents).map(([month, monthEvents]) => (
        <div key={month}>
          <DateScroller date={monthEvents[0].date.start} />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {monthEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default EventCards;
