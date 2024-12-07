import { toast } from "sonner";

import useAxios from "@/axios/useAxios";

import useUser from "../../../hooks/user/useUser";

const useAuth = () => {
  const api = useAxios();
  const { clearUser, updateUser } = useUser();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response && response.status === 200) {
        updateUser(response.data);
        toast.success(`Welcome back ${response.data.user.name}`);
        return response.data;
      }
    } catch (error) {
      if (error instanceof Error && "response" in error) {
        const serverError = error as {
          response: { data: { message: string } };
        };
        toast.error(serverError.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post("/auth/register", data);
      updateUser(response.data);
      toast.success(`Welcome to Recommendable, ${data.name}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error && "response" in error) {
        const serverError = error as {
          response: { data: { message: string } };
        };
        toast.error(serverError.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const logout = async () => {
    clearUser();
    toast.success("You have been logged out.");
  };

  return { logout, login, register };
};

export default useAuth;
