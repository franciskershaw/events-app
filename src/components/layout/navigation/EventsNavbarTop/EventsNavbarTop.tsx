import { SearchBar } from "../../../ui/search-bar";
import UsersInitials from "../../../user/UsersInitials/UsersInitials";
import Hamburger from "../Hamburger/Hamburger";

interface EventsNavbarTopProps {
  query: string;
  setQuery: (query: string) => void;
}

const EventsNavbarTop = ({ query, setQuery }: EventsNavbarTopProps) => {
  return (
    <>
      {/* Interactive Hamburger that's always on top of sidebar but below modals */}
      <div className="fixed top-4 right-4 z-[45]">
        <Hamburger />
      </div>

      {/* Navbar with invisible Hamburger for layout */}
      <nav className="box fixed top-0 left-0 right-0 bg-white z-30">
        <div className="flex justify-between items-center w-full p-4 space-x-4">
          <UsersInitials />
          <div className="flex-grow">
            <SearchBar
              placeholder="Search by title, venue, city, category or date"
              query={query}
              setQuery={setQuery}
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
