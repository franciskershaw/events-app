import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import {
  filterTodayEvents,
  groupEvents,
  isEventTypeguard,
} from "../../helper/helper";
import DateScroller from "../DateScroller";
import EventCard from "./EventCard";
import EventFreeCard from "./EventFreeCard";

const EventCards = () => {
  const { filteredEvents, filteredEventsFree, showEventsFree } = useSearch();
  const events = showEventsFree ? filteredEventsFree : filteredEvents;

  const todayEvents = filterTodayEvents(events);
  const upcomingEvents = groupEvents(
    events.filter((event) => !todayEvents.includes(event))
  );

  return (
    <>
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {todayEvents.map((event) =>
              showEventsFree ? (
                <EventFreeCard key={event._id} event={event} />
              ) : isEventTypeguard(event) ? (
                <EventCard key={event._id} event={event} />
              ) : null
            )}
          </div>
        </>
      )}

      {Object.entries(upcomingEvents).map(([month, monthEvents]) => (
        <div key={month}>
          <DateScroller date={monthEvents[0].date.start} />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {monthEvents.map((event) =>
              showEventsFree ? (
                <EventFreeCard key={event._id} event={event} />
              ) : isEventTypeguard(event) ? (
                <EventCard key={event._id} event={event} />
              ) : null
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default EventCards;
