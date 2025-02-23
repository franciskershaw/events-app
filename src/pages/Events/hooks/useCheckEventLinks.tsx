import { useQuery } from "@tanstack/react-query";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useCheckEventLinks = () => {
  const api = useAxios();
  const { user } = useUser();
  const { mode, selectedEvent } = useModals();

  const { data: linkedEventIds = [] } = useQuery({
    queryKey: [queryKeys.eventLinks, selectedEvent?._id],
    queryFn: async () => {
      const res = await api.get(`/events/${selectedEvent?._id}/linked`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      return res.data;
    },
    enabled: mode === "edit" && !!selectedEvent?._id,
    staleTime: 0,
    gcTime: 0,
  });

  return linkedEventIds;
};

export default useCheckEventLinks;
