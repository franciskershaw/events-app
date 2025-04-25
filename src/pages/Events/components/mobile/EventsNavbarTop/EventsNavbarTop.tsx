import { SearchBar } from "@/components/ui/search-bar";

import UsersInitials from "../../../../../components/user/UsersInitials/UsersInitials";
import { NAV_HEIGHT } from "../../../../../constants/app";
import { useSearch } from "../../../../../contexts/SearchEvents/SearchEventsContext";
import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";

const EventsNavbarTop = () => {
  const { isVisible: isNavbarVisible } = useScrollVisibility();
  const { activeFilterCount, clearAllFilters, query, setQuery } = useSearch();

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-primary z-30 transition-transform duration-300"
      style={{
        transform: `translateY(${isNavbarVisible ? "0px" : `-${NAV_HEIGHT}`})`,
      }}
    >
      <div className="flex justify-between items-center w-full p-4 gap-2 sm:gap-4">
        <UsersInitials />
        <div className="flex-grow">
          <SearchBar
            query={query}
            setQuery={setQuery}
            clearFilters={clearAllFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
        {/* Empty div to reserve space for the hamburger menu */}
        <div
          className="opacity-0 pointer-events-none wh-hamburger"
          aria-hidden="true"
        />
      </div>
    </nav>
  );
};

export default EventsNavbarTop;
