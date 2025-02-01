import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useGenerateConnectionId = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const generateConnectionId = async () => {
    const { data } = await api.post(
      "/users/connection-id",
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
    mutationFn: generateConnectionId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
    },
  });
};

export default useGenerateConnectionId;
