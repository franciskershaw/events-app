import { createContext, useContext, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

interface ActiveDayContextType {
  activeDay: Dayjs;
  setActiveDay: (day: Dayjs) => void;
}

const ActiveDayContext = createContext<ActiveDayContextType | undefined>(
  undefined
);

export const ActiveDayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeDay, setActiveDay] = useState<Dayjs>(dayjs());

  return (
    <ActiveDayContext.Provider value={{ activeDay, setActiveDay }}>
      {children}
    </ActiveDayContext.Provider>
  );
};

export const useActiveDay = () => {
  const context = useContext(ActiveDayContext);
  if (!context) {
    throw new Error("useActiveDay must be used within an ActiveDayProvider");
  }
  return context;
};
