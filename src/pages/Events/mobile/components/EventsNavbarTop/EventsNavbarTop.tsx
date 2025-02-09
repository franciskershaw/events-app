import Hamburger from "@/components/layout/navigation/Hamburger/Hamburger";
import { SearchBar } from "@/components/ui/search-bar";

import UsersInitials from "../../../../../components/user/UsersInitials/UsersInitials";
import { useSearch } from "../../../../../contexts/SearchEvents/SearchEventsContext";
import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";

interface EventsNavbarTopProps {
  query: string;
  setQuery: (query: string) => void;
}

const EventsNavbarTop = ({ query, setQuery }: EventsNavbarTopProps) => {
  const isNavbarVisible = useScrollVisibility();
  const { activeFilterCount, clearAllFilters } = useSearch();

  return (
    <>
      {/* Interactive Hamburger that's always on top of sidebar but below modals */}
      <div
        className={`fixed top-4 right-4 z-[45] transition-transform duration-300 ${isNavbarVisible ? "translate-y-[0px]" : "-translate-y-[84px]"}`}
      >
        <Hamburger />
      </div>

      {/* Navbar with invisible Hamburger for layout */}
      <nav
        className={`box fixed top-0 left-0 right-0 bg-white z-30 transition-transform duration-300 ${isNavbarVisible ? "translate-y-[0px]" : "-translate-y-[84px]"}`}
      >
        <div className="flex justify-between items-center w-full p-4 space-x-4">
          <UsersInitials />
          <div className="flex-grow">
            <SearchBar
              query={query}
              setQuery={setQuery}
              clearFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
          <div className="invisible">
            <Hamburger />
          </div>
        </div>
      </nav>
    </>
  );
};

export default EventsNavbarTop;
