import { useState } from "react";

import { motion } from "framer-motion";
import { FaChevronUp, FaPlus, FaRegCalendar } from "react-icons/fa";

import { DateTime } from "@/components/ui/date-time";

import { useModals } from "../../../../contexts/ModalsContext";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();
  const [isExpanded, setIsExpanded] = useState(false);
  const navHeight = 120;

  return (
    <>
      {/* Background layer */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-[125px] bg-white z-30"
        animate={{ y: isExpanded ? 0 : navHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        aria-hidden="true"
      />

      {/* Handle button */}
      <motion.div
        className="fixed bottom-[125px] left-0 right-0 h-6 bg-gray-100 rounded-t-lg z-40 flex justify-center items-center cursor-pointer"
        animate={{ y: isExpanded ? 0 : navHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-label="Toggle navigation menu"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronUp className="text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Navbar content */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-white z-40 py-4 space-y-4 h-[125px] flex flex-col justify-center items-center"
        animate={{ y: isExpanded ? 0 : navHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        role="navigation"
        aria-label="Date selection and view controls"
      >
        <div className="flex justify-around items-center">
          <DateTime placeholder="Pick a date range" />
          <DateTime placeholder="Pick a date range" />
        </div>
        <div className="flex justify-between w-full px-2 items-center gap-2">
          <Button size="round" onClick={() => openEventModal()}>
            <FaPlus />
          </Button>
          <div className="space-x-2">
            <Button size="round">D</Button>
            <Button size="round">W</Button>
            <Button size="round">M</Button>
          </div>
          <Button size="round">
            <FaRegCalendar />
          </Button>
        </div>
      </motion.nav>
    </>
  );
};

export default NavbarBottom;
