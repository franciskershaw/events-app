import UsersInitials from "../../../user/UsersInitials/UsersInitials";
import Hamburger from "../Hamburger/Hamburger";

const NavbarTop = () => {
  return (
    <nav className="box fixed top-0 left-0 right-0 bg-white z-30">
      <div className="flex justify-between items-center w-full p-4 space-x-4">
        <UsersInitials />
        <div className="box flex-grow">
          <input type="text" placeholder="Search" />
        </div>
        <Hamburger />
      </div>
    </nav>
  );
};

export default NavbarTop;
