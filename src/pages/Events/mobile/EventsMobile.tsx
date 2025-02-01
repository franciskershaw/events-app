import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import EventCards from "./../mobile/components/EventCards/EventCards";
import EventsNavbarTop from "./../mobile/components/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "./../mobile/components/FiltersDrawer/FiltersDrawer";

export const EventsMobile = () => {
  const { query, setQuery, filteredEvents } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      {filteredEvents.length === 0 ? (
        <p className="p-4">No events found.</p>
      ) : (
        <EventCards />
      )}
      <FiltersDrawer />
    </>
  );
};
