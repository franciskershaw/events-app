import { motion, useMotionValue } from "framer-motion";
import { FaChevronUp, FaPlus, FaRegCalendar } from "react-icons/fa";

import { DateTime } from "@/components/ui/date-time";

import { useModals } from "../../../../contexts/ModalsContext";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();
  const y = useMotionValue(0);
  const navHeight = 120;

  return (
    <>
      <motion.div
        className="fixed bottom-[125px] left-0 right-0 h-6 bg-gray-100 rounded-t-lg z-30 flex justify-center items-center cursor-grab"
        drag="y"
        dragConstraints={{ top: 0, bottom: navHeight }}
        dragElastic={0.1}
        style={{ y }}
      >
        <FaChevronUp className="text-gray-400" />
      </motion.div>

      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-white z-30 py-4 space-y-4 h-[125px] flex flex-col justify-center items-center"
        style={{ y }}
      >
        <div className="flex justify-around items-center">
          <DateTime placeholder="Pick a date range" />
          <DateTime placeholder="Pick a date range" />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button size="round" onClick={() => openEventModal()}>
            <FaPlus />
          </Button>
          <Button size="round">D</Button>
          <Button size="round">W</Button>
          <Button size="round">M</Button>
          <Button size="round">
            <FaRegCalendar />
          </Button>
        </div>
      </motion.nav>
    </>
  );
};

export default NavbarBottom;
