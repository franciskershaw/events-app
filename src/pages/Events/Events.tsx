import EventCards from "./components/EventCards";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  // Removed the loading state for now to have an optimistic update
  // const { events, fetchingEvents, errorFetchingEvents } = useGetEvents();
  const { events } = useGetEvents();

  // TODO: Revist initial loading state

  // if (fetchingEvents) return <p>Loading events...</p>;
  // if (errorFetchingEvents) return <p>Error fetching events</p>;

  // TOZO: Refactor to populate empty event cards within time period

  return (
    <>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          <div className="top-0 left-0 right-0 fixed h-[60px] bg-white/90 z-10"></div>
          {events.length > 0 && <EventCards events={events} />}
        </>
      )}
    </>
  );
};

export default Events;
