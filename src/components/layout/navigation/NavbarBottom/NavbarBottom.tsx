import { FaChevronUp, FaPlus, FaRegCalendar } from "react-icons/fa";

import { DateTime } from "@/components/ui/date-time";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useModals } from "../../../../contexts/ModalsContext";
import { Button } from "../../../ui/button";

const NavbarBottom = () => {
  const { openEventModal } = useModals();

  return (
    <Drawer>
      {/* Trigger button */}
      <DrawerTrigger asChild>
        <div
          className="fixed bottom-0 left-0 right-0 h-6 bg-gray-100 rounded-t-lg z-40 flex justify-center items-center cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <FaChevronUp className="text-gray-400" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="pb-4 px-4">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Adjust date ranges and view options
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-cente">
            <DateTime placeholder="Pick a date range" />
            <DateTime placeholder="Pick a date range" />
          </div>
          <div className="flex justify-between w-full items-center gap-2">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavbarBottom;
