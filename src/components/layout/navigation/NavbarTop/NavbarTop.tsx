const NavbarTop = () => {
  return (
    <nav className="box fixed top-0 left-0 right-0 bg-white">
      <div className="flex justify-between items-center w-full p-2 space-x-4">
        <div>ZT</div>
        <div className="box flex-grow">Search bar</div>
        <div>Burger</div>
      </div>
    </nav>
  );
};

export default NavbarTop;
