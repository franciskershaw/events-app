import { useSearch } from "../../../contexts/SearchEventsContext";
import { filterTodayEvents, groupEvents } from "../helper/helper";
import DateScroller from "./DateScroller";
import EventCard from "./EventCard";

const EventCards = () => {
  const { filteredEvents } = useSearch();

  const todayEvents = filterTodayEvents(filteredEvents);
  const upcomingEvents = groupEvents(
    filteredEvents.filter((event) => !todayEvents.includes(event))
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
