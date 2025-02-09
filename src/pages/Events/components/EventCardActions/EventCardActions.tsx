import { useEffect, useState } from "react";

import { FaCheck, FaTimes } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import { Event } from "@/types/globalTypes";

import { shareEvent } from "../../helpers/helpers";
import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

interface EventCardActionsProps {
  event: Event;
}

const EventCardActions = ({ event }: EventCardActionsProps) => {
  const { openEventModal, openDeleteEventModal } = useModals();
  const { mutate: toggleEventConfirmation } = useToggleConfirmEvent();

  const { user } = useUser();

  const [buttonStatus, setButtonStatus] = useState<
    "default" | "success" | "error"
  >("default");

  useEffect(() => {
    if (buttonStatus !== "default") {
      const timer = setTimeout(() => setButtonStatus("default"), 2000);
      return () => clearTimeout(timer);
    }
  }, [buttonStatus]);

  const handleShare = () => {
    const message = shareEvent({ event });
    if (!message) {
      setButtonStatus("error");
      return;
    }

    navigator.clipboard
      .writeText(message)
      .then(() => setButtonStatus("success"))
      .catch(() => setButtonStatus("error"));
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
        className={`transition-all duration-300 ${
          buttonStatus === "success"
            ? "bg-green-500"
            : buttonStatus === "error"
              ? "bg-red-500"
              : "bg-gray-500"
        }`}
      >
        {getShareButtonContent()}
      </Button>
      <Button
        size="round"
        onClick={() => openEventModal({ ...event, _id: "" }, "copy")}
      >
        Copy
      </Button>
      {event.createdBy._id === user?._id && (
        <>
          <Button size="round" onClick={() => openEventModal(event, "edit")}>
            Edit
          </Button>
          <Button size="round" onClick={() => openDeleteEventModal(event)}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default EventCardActions;
