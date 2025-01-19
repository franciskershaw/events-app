import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";
import { formatDate, formatTime, isWeekend } from "@/lib/utils";
import { Event } from "@/types/globalTypes";

const EventCard = ({ event }: { event: Event }) => {
  const { location, title, category, description } = event;
  const [isOpen, setIsOpen] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const { openEventModal, openDeleteEventModal } = useModals();
  const swipeBlockRef = useRef(false);
  const duration = 0.3;

  const toggleBody = () => {
    if (!swipeBlockRef.current && !isSwiped) {
      setIsOpen((prev) => !prev);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setIsSwiped(true);
      setIsOpen(false);
      blockToggleTemporarily();
    },
    onSwipedRight: () => {
      setIsSwiped(false);
      blockToggleTemporarily();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const blockToggleTemporarily = () => {
    swipeBlockRef.current = true;
    setTimeout(() => {
      swipeBlockRef.current = false;
    }, duration * 1000);
  };

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.date);
  const weekend = isWeekend(event.date.start);

  return (
    <div
      className={`relative border rounded-md shadow-sm bg-white hover:shadow-md transition-all overflow-x-hidden ${
        weekend ? "border-blue-500" : "border-gray-200"
      }`}
      {...swipeHandlers}
    >
      <div onClick={toggleBody}>
        <motion.div
          className={`flex flex-col gap-3 p-4 cursor-pointer`}
          initial={{ translateX: 0 }}
          animate={{ translateX: isSwiped ? -100 : 0 }}
          transition={{ duration: duration }}
        >
          <div className="absolute top-0 right-0 bottom-0 px-1 py-2">
            <div
              className="w-1 h-full rounded-full bg-secondary"
              aria-hidden="true"
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm truncate flex-1">{title}</h2>
            {location?.city && (
              <span className="ml-4 text-gray-700 font-medium text-sm">
                📍 {location.city}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formattedDate}</span>
            <Badge variant="secondary">{category.name}</Badge>
          </div>
        </motion.div>

        <motion.div
          className={`absolute top-0 right-0 bottom-0 w-full bg-white`}
          style={{ width: "100%" }}
          initial={{ translateX: "100%" }}
          animate={{ translateX: isSwiped ? 0 : "100%" }}
          transition={{ duration: duration }}
        >
          <div className="relative flex items-center justify-center gap-4 h-full">
            <div className="absolute top-0 left-0 bottom-0 px-1 py-2">
              <div
                className="w-1 h-full rounded-full bg-secondary"
                aria-hidden="true"
              ></div>
            </div>
            <Button
              size="round"
              onClick={() => openEventModal({ ...event, _id: "" }, "copy")}
            >
              Copy
            </Button>
            <Button size="round" onClick={() => openEventModal(event, "edit")}>
              Edit
            </Button>
            <Button size="round" onClick={() => openDeleteEventModal(event)}>
              Delete
            </Button>
            {/* <Button size="round">Private</Button> */}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: duration }}
        className="overflow-hidden rounded-b-md"
      >
        <div className="px-4 pb-4 pt-0 space-y-4">
          {(location?.venue || formattedTime) && (
            <div className="mx-[-1rem] px-4 py-2 bg-gray-200 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm whitespace-nowrap min-w-min">
                {location?.venue && (
                  <Badge variant="secondary">{location.venue}</Badge>
                )}
                {formattedTime && (
                  <Badge variant="secondary">{formattedTime}</Badge>
                )}
              </div>
            </div>
          )}

          {description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
