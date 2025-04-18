import dayjs from "dayjs";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { useModals } from "../../../../../contexts/Modals/ModalsContext";

export const AddEventButton = ({ text = "Add event +" }) => {
  const { openEventModal } = useModals();
  const { activeDay } = useActiveDay();

  return (
    <button
      className={`text-highlight hover:underline ${text === "Add event +" ? "my-4 w-full" : ""}`}
      onClick={() =>
        openEventModal(
          {
            _id: "",
            title: "",
            date: {
              start: activeDay ? activeDay.startOf("day").toISOString() : "",
              end: "",
            },
            category: { _id: "", name: "", icon: "" },
            createdBy: { _id: "", name: "" },
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
            unConfirmed: false,
            private: false,
          },
          "addFromFreeEvent"
        )
      }
    >
      {text}
    </button>
  );
};
