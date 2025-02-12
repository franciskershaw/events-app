import { useSidebar } from "@/contexts/Sidebar/mobile/SidebarContext";

import { useIsMobile } from "../../../../hooks/use-mobile";

const Hamburger = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const bgColor = isMobile ? "bg-secondary" : "bg-primary";
  const fgColor = isMobile
    ? "bg-secondary-foreground"
    : "bg-primary-foreground";

  return (
    <button
      className={`relative z-50 transition-all duration-200`}
      onClick={(e) => {
        e.stopPropagation();
        toggleSidebar();
      }}
    >
      <div
        className={`relative flex overflow-hidden items-center justify-center rounded-full ${isMobile ? "w-12 h-12" : "w-14 h-14"} ${bgColor} transform transition-all`}
      >
        <div className="flex flex-col justify-between w-5 h-5 transform transition-all duration-300 origin-center overflow-hidden">
          <div
            className={`h-[2px] w-7 transform transition-all duration-300 origin-left  ${fgColor} ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>
          <div
            className={`h-[2px] w-7 rounded transform transition-all duration-300 delay-75  ${fgColor} ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>
          <div
            className={`h-[2px] w-7 transform transition-all duration-300 origin-left delay-150  ${fgColor} ${
              isExpanded ? "translate-x-10" : ""
            }`}
          ></div>

          <div
            className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 flex  ${fgColor} ${
              isExpanded ? "translate-x-0 w-12" : "-translate-x-10 w-0"
            }`}
          >
            <div
              className={`absolute h-[2px] w-5 transform transition-all duration-500 delay-300  ${fgColor} ${
                isExpanded ? "rotate-45" : "rotate-0"
              }`}
            ></div>
            <div
              className={`absolute h-[2px] w-5 transform transition-all duration-500 delay-300  ${fgColor} ${
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
