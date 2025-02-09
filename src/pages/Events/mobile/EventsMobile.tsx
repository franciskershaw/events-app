import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import EventCards from "./../mobile/components/EventCards/EventCards";
import EventsNavbarTop from "./../mobile/components/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "./../mobile/components/FiltersDrawer/FiltersDrawer";
import { EmptyState } from "./components/EmptyState/EmptyState";

export const EventsMobile = () => {
  const { query, setQuery, filteredEvents } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      {filteredEvents.length === 0 ? <EmptyState /> : <EventCards />}
      <FiltersDrawer />
    </>
  );
};
