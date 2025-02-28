import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();
  const { closeModal } = useModals();
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
      closeModal();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export default useDeleteEvent;
