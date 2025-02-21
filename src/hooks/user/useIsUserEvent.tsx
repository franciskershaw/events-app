import { useMemo } from "react";

import { Event } from "@/types/globalTypes";

import useUser from "./useUser";

const useIsUserEvent = (event: Event) => {
  const { user } = useUser();

  const userEvent = useMemo(() => {
    if (!user) return false;
    return user?._id === event.createdBy._id;
  }, [event, user]);

  return userEvent;
};

export default useIsUserEvent;
