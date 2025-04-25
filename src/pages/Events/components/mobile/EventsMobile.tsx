import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import { EmptyStateNoResults } from "@/pages/Events/components/global/EmptyStateNoResults/EmptyStateNoResults";
import { EmptyStateNoEvents } from "@/pages/Events/components/mobile/EmptyStateNoEvents/EmptyStateNoEvents";
import EventCards from "@/pages/Events/components/mobile/EventCards/EventCards";
import EventsNavbarTop from "@/pages/Events/components/mobile/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "@/pages/Events/components/mobile/FiltersDrawer/FiltersDrawer";

export const EventsMobile = () => {
  const { filteredEvents, activeFilterCount } = useSearch();

  return (
    <>
      <EventsNavbarTop />
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
