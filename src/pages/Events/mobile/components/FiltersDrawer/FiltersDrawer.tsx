import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Filters from "../../../components/Filters/Filters";

const FiltersDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className="fixed bottom-0 left-0 right-0 h-6 bg-gray-100 rounded-t-lg shadow-md z-30 flex items-center justify-center gap-2 cursor-pointer"
          role="button"
          aria-label="Open filters"
          tabIndex={0}
        >
          <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription className="sr-only">
            Adjust date ranges and view options
          </DrawerDescription>
        </DrawerHeader>
        <Filters />
      </DrawerContent>
    </Drawer>
  );
};

export default FiltersDrawer;
