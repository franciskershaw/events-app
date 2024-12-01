import EventCards from "./components/EventCards";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { events, fetchingEvents, errorFetchingEvents } = useGetEvents();
  const {
    events: pastEvents,
    fetchingEvents: fetchingPastEvents,
    errorFetchingEvents: errorFetchingPastEvents,
  } = useGetEvents("past");

  if (fetchingEvents || fetchingPastEvents) return <p>Loading events...</p>;
  if (errorFetchingEvents || errorFetchingPastEvents)
    return <p>Error fetching events</p>;

  // TOZO: Refactor to populate empty event cards within time period

  console.log(events);

  return (
    <>
      {events.length === 0 && pastEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          {pastEvents.length > 0 && <EventCards events={pastEvents} />}
          {events.length > 0 && <EventCards events={events} />}
        </>
      )}
    </>
  );
};

export default Events;
