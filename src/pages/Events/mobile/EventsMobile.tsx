import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { EmptyStateNoResults } from "../components/EmptyStateNoResults/EmptyStateNoResults";
import EventCards from "./../mobile/components/EventCards/EventCards";
import EventsNavbarTop from "./../mobile/components/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "./../mobile/components/FiltersDrawer/FiltersDrawer";
import { EmptyStateNoEvents } from "./components/EmptyStateNoEvents/EmptyStateNoEvents";

export const EventsMobile = () => {
  const { query, setQuery, filteredEvents, activeFilterCount } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      {filteredEvents.length === 0 ? (
        activeFilterCount > 0 ? (
          <EmptyStateNoResults />
        ) : (
          <EmptyStateNoEvents />
        )
      ) : (
        <EventCards />
      )}
      <FiltersDrawer />
    </>
  );
};
