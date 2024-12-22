import { FaPlus, FaRegCalendar } from "react-icons/fa";

import { DateTime } from "@/components/ui/date-time";

import { useModals } from "../../../../contexts/ModalsContext";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();

  return (
    <nav className="box fixed bottom-0 left-0 right-0 bg-white z-30 py-4 space-y-4">
      <div className="flex justify-center items-center">
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
    </nav>
  );
};

export default NavbarBottom;
