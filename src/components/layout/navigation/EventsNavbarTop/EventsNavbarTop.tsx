import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
// import Hamburger from "../Hamburger/Hamburger";

import useAuth from "@/pages/Auth/hooks/useAuth";

import { SearchBar } from "../../../ui/search-bar";
import UsersInitials from "../../../user/UsersInitials/UsersInitials";

interface EventsNavbarTopProps {
  query: string;
  setQuery: (query: string) => void;
}

const EventsNavbarTop: React.FC<EventsNavbarTopProps> = ({
  query,
  setQuery,
}) => {
  const { logout } = useAuth();

  return (
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
        {/* <Hamburger /> */}
        <Button onClick={logout} size="round">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default EventsNavbarTop;
