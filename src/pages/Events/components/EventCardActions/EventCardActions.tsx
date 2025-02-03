import { useState } from "react";

import { FaCheck, FaTimes } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";
import { Event } from "@/types/globalTypes";

import useShareEvent from "../../hooks/useShareEvent";
import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

interface EventCardActionsProps {
  event: Event;
}

const EventCardActions = ({ event }: EventCardActionsProps) => {
  const { openEventModal, openDeleteEventModal } = useModals();
  const { mutate: toggleEventConfirmation } = useToggleConfirmEvent();

  const [buttonStatus, setButtonStatus] = useState<
    "default" | "success" | "error"
  >("default");

  const handleShare = () => {
    const message = useShareEvent({ event });
    if (!message) {
      setButtonStatus("error");
      resetButton();
      return;
    }

    navigator.clipboard
      .writeText(message)
      .then(() => {
        setButtonStatus("success");
        resetButton();
      })
      .catch(() => {
        setButtonStatus("error");
        resetButton();
      });
  };

  const resetButton = () => {
    setTimeout(() => {
      setButtonStatus("default");
    }, 2000);
  };

  const getShareButtonContent = () => {
    switch (buttonStatus) {
      case "error":
        return <FaTimes />;
      case "success":
        return <FaCheck />;
      default:
        return "Share";
    }
  };

  return (
    <div className="flex gap-2">
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
        onClick={handleShare}
        variant={
          buttonStatus === "success"
            ? "success"
            : buttonStatus === "error"
              ? "destructive"
              : "default"
        }
      >
        {getShareButtonContent()}
      </Button>
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
  );
};

export default EventCardActions;
