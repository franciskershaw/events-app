import { useState } from "react";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { useModals } from "@/contexts/ModalsContext";

import { Button } from "../../../components/ui/button";
import { formatDate, formatTime, isWeekend } from "../../../lib/utils";
import { Event } from "../../../types/globalTypes";

const EventCard = ({ event }: { event: Event }) => {
  const { location, title, category, description } = event;
  const [isOpen, setIsOpen] = useState(false);
  const { openEventModal, openDeleteEventModal } = useModals();

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.date);
  const weekend = isWeekend(event.date.start);

  const toggleBody = () => setIsOpen((prev) => !prev);

  return (
    // <div
    //   className={`border rounded-lg shadow-sm bg-white hover:shadow-md transition-all ${
    //     weekend ? "border-blue-500" : "border-gray-200"
    //   }`}
    <div
      className={
        "border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
      }
    >
      <div
        className={`flex flex-col gap-3 p-4 rounded-t-lg cursor-pointer`}
        onClick={toggleBody}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold truncate flex-1">{title}</h2>

          {location?.city && (
            <span className="ml-4 text-gray-700 font-medium text-sm">
              📍 {location.city}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formattedDate}</span>
          <span className="text-sm px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
            {category.name}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="border-t border-gray-200 overflow-hidden"
      >
        <div className="px-4 pb-4 pt-0 bg-gray-50 space-y-4">
          <div className="mx-[-1rem] px-4 py-2 bg-gray-200 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap min-w-min">
              {location?.venue && (
                <Badge variant="secondary">{location.venue}</Badge>
              )}
              <Badge variant="secondary">{formattedTime}</Badge>
              <Badge variant="secondary">{category.name}</Badge>
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button size="round">Copy</Button>
            <Button size="round" onClick={() => openEventModal(event)}>
              Edit
            </Button>
            <Button size="round" onClick={() => openDeleteEventModal(event)}>
              Delete
            </Button>
            <Button size="round">Private</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
