import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useMakeEventPrivate = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const makeEventPrivate = async (eventId: string) => {
    const { data } = await api.patch(
      `/events/${eventId}/privacy`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    return data;
  };

  return useMutation({
    mutationFn: makeEventPrivate,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success(`Event made ${response.private ? "private" : "visible"}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};

export default useMakeEventPrivate;
