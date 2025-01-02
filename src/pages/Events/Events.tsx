import { useMemo } from "react";

import EventsNavbarTop from "../../components/layout/navigation/EventsNavbarTop/EventsNavbarTop";
import { SearchProvider, useSearch } from "../../contexts/SearchEventsContext";
import EventCards from "./components/EventCards";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { events } = useGetEvents();
  const initialEvents = useMemo(() => events || [], [events]);

  console.log(events);
  console.log(initialEvents);

  return (
    <SearchProvider initialEvents={initialEvents}>
      <EventsWithSearch />
    </SearchProvider>
  );
};

// Extracted child component to use context
const EventsWithSearch = () => {
  const { query, setQuery, filteredEvents } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      <div className="p-4">
        {filteredEvents.length === 0 ? <p>No events found.</p> : <EventCards />}
      </div>
    </>
  );
};

export default Events;
