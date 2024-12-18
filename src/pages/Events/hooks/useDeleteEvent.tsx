import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const deleteEvent = async (data: { _id: string }) => {
    const { _id } = data;

    return await api.delete(`/events/${_id}`, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
  };

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteEvent;