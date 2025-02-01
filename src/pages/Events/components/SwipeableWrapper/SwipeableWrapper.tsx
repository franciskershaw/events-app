import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import { Button } from "@/components/ui/button";
import SwipeableIndicator from "@/components/utility/SwipeableIndicator/SwipeableIndicator";
import { useModals } from "@/contexts/Modals/ModalsContext";
import { Event } from "@/types/globalTypes";

import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

interface SwipeableWrapperProps {
  children: React.ReactNode;
  event: Event;
}

const SwipeableWrapper = ({ children, event }: SwipeableWrapperProps) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const swipeBlockRef = useRef(false);
  const duration = 0.3;

  const { openEventModal, openDeleteEventModal } = useModals();
  const { mutate: toggleEventConfirmation } = useToggleConfirmEvent();

  const blockToggleTemporarily = () => {
    swipeBlockRef.current = true;
    setTimeout(() => {
      swipeBlockRef.current = false;
    }, duration * 1000);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setIsSwiped(true);
      blockToggleTemporarily();
    },
    onSwipedRight: () => {
      setIsSwiped(false);
      blockToggleTemporarily();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="relative" {...swipeHandlers}>
      <div className="relative z-10">{children}</div>

      <motion.div
        className="absolute top-0 right-0 bottom-0 bg-white bg-opacity-80 z-20"
        style={{ width: "100%" }}
        initial={{ translateX: "100%" }}
        animate={{ translateX: isSwiped ? 0 : "100%" }}
        transition={{ duration }}
      >
        <div className="relative flex items-center justify-center gap-2 h-full">
          <SwipeableIndicator orientation="vertical" alignment="left" />
          {event.unConfirmed && (
            <Button
              size="round"
              onClick={() =>
                toggleEventConfirmation({
                  eventId: event._id,
                  unConfirmed: event.unConfirmed,
                })
              }
            >
              Confirm
            </Button>
          )}
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
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableWrapper;
