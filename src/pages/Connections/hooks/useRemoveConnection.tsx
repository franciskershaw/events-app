import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useRemoveConnection = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const removeConnection = async (data: { _id: string }) => {
    const { _id } = data;

    return await api.delete(`/connections/${_id}`, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
  };

  return useMutation({
    mutationFn: removeConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Connection removed successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export default useRemoveConnection;
