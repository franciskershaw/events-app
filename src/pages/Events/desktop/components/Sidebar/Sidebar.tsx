import { FaChevronRight } from "react-icons/fa";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../../../components/ui/drawer";

// Work out how to do dismiss functionality - needs to push columns over to right, needs to not close when you set different days

const Sidebar = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <div
          className="fixed top-0 left-0 bottom-0 w-6 bg-gray-100 rounded-t-lg z-30 flex justify-center items-center cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <FaChevronRight className="text-gray-400" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="px-4" orientation="left" overlay={false}>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription className="sr-only">
            Adjust date ranges and view options
          </DrawerDescription>
        </DrawerHeader>
        Hello!
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
