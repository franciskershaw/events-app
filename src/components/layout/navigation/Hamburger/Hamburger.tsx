import { useSidebar } from "@/contexts/Sidebar/SidebarContext";

const Hamburger = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <button
      className={`relative z-50 transition-all duration-200`}
      onClick={(e) => {
        e.stopPropagation();
        toggleSidebar();
      }}
    >
      <div className="relative flex overflow-hidden items-center justify-center rounded-full w-12 h-12 transform transition-all bg-secondary text-secondary-foreground">
        <div className="flex flex-col justify-between w-5 h-5 transform transition-all duration-300 origin-center overflow-hidden">
          <div
            className={`bg-secondary-foreground h-[2px] w-7 transform transition-all duration-300 origin-left ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>
          <div
            className={`bg-secondary-foreground h-[2px] w-7 rounded transform transition-all duration-300 delay-75 ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>
          <div
            className={`bg-secondary-foreground h-[2px] w-7 transform transition-all duration-300 origin-left delay-150 ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>

          <div
            className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 flex ${
              isExpanded ? "translate-x-0 w-12" : "-translate-x-10 w-0"
            }`}
          >
            <div
              className={`absolute bg-secondary-foreground h-[2px] w-5 transform transition-all duration-500 delay-300 ${
                isExpanded ? "rotate-45" : "rotate-0"
              }`}
            ></div>
            <div
              className={`absolute bg-secondary-foreground h-[2px] w-5 transform transition-all duration-500 delay-300 ${
                isExpanded ? "-rotate-45" : "rotate-0"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Hamburger;
