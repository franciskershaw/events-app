import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Hamburger from "../Hamburger/Hamburger";

import useAuth from "@/pages/Auth/hooks/useAuth";

import UsersInitials from "../../../user/UsersInitials/UsersInitials";

const NavbarTop = () => {
  const { logout } = useAuth();
  return (
    <nav className="box fixed top-0 left-0 right-0 bg-white z-30">
      <div className="flex justify-between items-center w-full p-4 space-x-4">
        <UsersInitials />
        {/* <div className="flex-grow">
          <Input placeholder="Search" />
        </div> */}
        {/* <Hamburger /> */}
        <Button onClick={logout} size="round">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default NavbarTop;
