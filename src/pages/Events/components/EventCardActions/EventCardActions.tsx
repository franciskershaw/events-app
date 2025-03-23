import { useEffect, useState } from "react";

import {
  FaCheck,
  FaCopy,
  FaEdit,
  FaLock,
  FaShare,
  FaThumbsUp,
  FaTimes,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import { cn } from "@/lib/utils";
import { Event } from "@/types/globalTypes";

import { shareEvent } from "../../helpers/helpers";
import useMakeEventPrivate from "../../hooks/useMakeEventPrivate";
import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

interface EventCardActionsProps {
  event: Event;
}

const EventCardActions = ({ event }: EventCardActionsProps) => {
  const { openEventModal, openDeleteEventModal } = useModals();
  const { mutate: toggleEventConfirmation } = useToggleConfirmEvent();
  const { mutate: makeEventPrivate } = useMakeEventPrivate();

  const { user } = useUser();

  const ownsEvent = event.createdBy._id === user?._id;

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
        return (
          <div className="flex items-center">
            <FaTimes className="mr-1 text-[10px]" />
            <span>Error</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center">
            <FaCheck className="mr-1 text-[10px]" />
            <span>Copied</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <FaShare className="mr-1 text-[10px]" />
            <span>Share</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {/* Top row - Edit, Copy, Delete */}
      {ownsEvent && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openEventModal(event, "edit")}
          className="text-xs px-2 py-1 h-7 w-[84px]"
        >
          <FaEdit className="mr-1 text-[10px]" />
          Edit
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          openEventModal(event, ownsEvent ? "copy" : "copyFromConnection")
        }
        className="text-xs px-2 py-1 h-7 w-[84px]"
      >
        <FaCopy className="mr-1 text-[10px]" />
        Copy
      </Button>
      {ownsEvent && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openDeleteEventModal(event)}
          className="text-xs px-2 py-1 h-7 border-red-300 hover:bg-red-50 w-[84px]"
        >
          <FaTrash className="mr-1 text-[10px] text-red-500" />
          Delete
        </Button>
      )}

      {/* Bottom row - Share, Public/Private, Confirm */}
      <Button
        size="sm"
        onClick={handleShare}
        variant={
          buttonStatus === "success"
            ? "success"
            : buttonStatus === "error"
              ? "destructive"
              : "default"
        }
        className={cn(
          "text-xs px-2 py-1 h-7 transition-all duration-300 w-[84px]",
          buttonStatus === "success" ? "bg-success" : "",
          buttonStatus === "error" ? "bg-red-500" : ""
        )}
      >
        {getShareButtonContent()}
      </Button>
      {ownsEvent && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => makeEventPrivate(event._id)}
          className="text-xs px-2 py-1 h-7 w-[84px]"
        >
          {event.private ? (
            <>
              <FaUnlock className="mr-1 text-[10px]" />
              Public
            </>
          ) : (
            <>
              <FaLock className="mr-1 text-[10px]" />
              Private
            </>
          )}
        </Button>
      )}
      {event.unConfirmed && ownsEvent && (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toggleEventConfirmation({
              eventId: event._id,
              unConfirmed: event.unConfirmed,
            })
          }
          className="text-xs px-2 py-1 h-7 w-[84px]"
        >
          <FaThumbsUp className="mr-1 text-[10px]" />
          Confirm
        </Button>
      )}
    </div>
  );
};

export default EventCardActions;
