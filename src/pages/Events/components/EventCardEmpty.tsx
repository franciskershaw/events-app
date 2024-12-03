import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../../../lib/utils";
import useGetWeekend from "../../../hooks/utility/useGetWeekend";

export interface EventCardEmptyProps {
  date: string;
}

const EventCardEmpty = ({ date }: EventCardEmptyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleBody = () => setIsOpen((prev) => !prev);

  const formattedDate = formatDate({ start: date, end: date });
  const isWeekend = useGetWeekend(date);

  return (
    <div className="event-card">
      <div
        className={`event-card-header flex items-center space-x-2 box rounded-md p-2 relative cursor-pointer ${isWeekend && "border-4"}`}
        onClick={toggleBody}
      >
        <div className="box p-1 rounded-md min-w-[75px] text-center whitespace-nowrap">
          <p>{formattedDate}</p>
        </div>
      </div>
      <motion.div
        className="event-card-body box mx-2 border-t-0 rounded-md rounded-t-none overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{
          height: { duration: 0.3 },
          opacity: { duration: isOpen ? 0.1 : 0.3 },
        }}
      >
        {/* Buttons */}
        <div className="flex justify-center space-x-2">
          <Button size="round">Copy</Button>
          <Button size="round">Edit</Button>
          <Button size="round">Delete</Button>
          <Button size="round">Private</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCardEmpty;
