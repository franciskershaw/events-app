import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useConnectUsers = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const connectUsers = async (connectionId: string) => {
    const { data } = await api.post(
      "/users/connections",
      {
        connectionId,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    return data;
  };

  return useMutation({
    mutationFn: connectUsers,
    onSuccess: (connectedUser) => {
      queryClient.setQueryData([queryKeys.user], (oldData: typeof user) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          connections: [...oldData.connections, connectedUser],
        };
      });
      toast.success(`Connected with ${connectedUser.name}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export default useConnectUsers;
