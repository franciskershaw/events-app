import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useToggleConfirmEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const toggleConfirmEvent = async (eventId: string, unConfirmed: boolean) => {
    const { data } = await api.put(
      `/events/${eventId}`,
      { unConfirmed: !unConfirmed },
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    return data;
  };

  return useMutation({
    mutationFn: ({
      eventId,
      unConfirmed,
    }: {
      eventId: string;
      unConfirmed: boolean;
    }) => toggleConfirmEvent(eventId, unConfirmed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Event confirmed!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export default useToggleConfirmEvent;
