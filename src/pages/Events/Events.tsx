import EventCard, { EventCardProps } from "./components/EventCard";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { events, fetchingEvents, errorFetchingEvents } = useGetEvents();

  if (fetchingEvents) return <p>Loading events...</p>;
  if (errorFetchingEvents) return <p>Error fetching events</p>;

  // TOZO: Refactor to populate empty event cards within time period

  return (
    <>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event: EventCardProps["event"]) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </>
  );
};

export default Events;
