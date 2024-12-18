import EventCards from "./components/EventCards";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  // Removed the loading state for now to have an optimistic update
  // const { events, fetchingEvents, errorFetchingEvents } = useGetEvents();
  const { events } = useGetEvents();

  return (
    <>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>{events.length > 0 && <EventCards events={events} />}</>
      )}
    </>
  );
};

export default Events;
