import { renderHook } from "@testing-library/react";
import { AxiosInstance } from "axios";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { User } from "@/types/globalTypes";

import useAuth from "../../hooks/useAuth";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");

// Type for mocking useUser return
type UserHookReturn = ReturnType<typeof useUser>;

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully and update user data", async () => {
      // Mock API response
      const mockUserData: User = {
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        accessToken: "test-token",
        connections: [],
      };

      // Create a complete mock Axios instance
      const mockPost = vi.fn().mockResolvedValueOnce({
        status: 200,
        data: mockUserData,
      });

      const mockAxiosInstance = {
        defaults: {},
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
        },
        getUri: vi.fn(),
        request: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
        head: vi.fn(),
        options: vi.fn(),
        post: mockPost,
        put: vi.fn(),
        patch: vi.fn(),
        postForm: vi.fn(),
        putForm: vi.fn(),
        patchForm: vi.fn(),
      } as unknown as AxiosInstance;

      // Mock hooks
      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      const updateUserMock = vi.fn();
      vi.mocked(useUser).mockReturnValue({
        clearUser: vi.fn().mockResolvedValue(undefined),
        updateUser: updateUserMock,
        user: null,
        fetchingUser: false,
      } as UserHookReturn);

      const { result } = renderHook(() => useAuth());

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };
      const response = await result.current.login(credentials);

      expect(response).toEqual(mockUserData);
      expect(updateUserMock).toHaveBeenCalledWith(mockUserData);
      expect(toast.success).toHaveBeenCalledWith(
        `Welcome back ${mockUserData.name}`
      );
    });

    it("should handle login API error with server message", async () => {
      // Create a proper server error that matches the shape expected in the hook
      const errorMessage = "Invalid credentials";
      const serverError = new Error("API Error") as Error & {
        response: { data: { message: string } };
      };
      // Add the response property to the error object
      serverError.response = {
        data: {
          message: errorMessage,
        },
      };

      // Create mock axios instance
      const mockPost = vi.fn().mockRejectedValueOnce(serverError);
      const mockAxiosInstance = { post: mockPost } as unknown as AxiosInstance;

      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      const { result } = renderHook(() => useAuth());

      const credentials = {
        email: "test@example.com",
        password: "wrong-password",
      };
      const response = await result.current.login(credentials);

      expect(response).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it("should handle unexpected login errors", async () => {
      // Mock unexpected API error
      const mockPost = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"));
      const mockAxiosInstance = { post: mockPost } as unknown as AxiosInstance;

      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      const { result } = renderHook(() => useAuth());

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };
      const response = await result.current.login(credentials);

      expect(response).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred.");
    });
  });

  describe("register", () => {
    it("should register successfully and update user data", async () => {
      // Mock API response
      const registerData = {
        name: "New User",
        email: "new@example.com",
        password: "password123",
      };

      const mockUserData: User = {
        _id: "user123",
        name: registerData.name,
        email: registerData.email,
        accessToken: "test-token",
        connections: [],
      };

      // Mock axios instance
      const mockPost = vi.fn().mockResolvedValueOnce({
        data: mockUserData,
      });
      const mockAxiosInstance = { post: mockPost } as unknown as AxiosInstance;

      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      // Mock useUser hook
      const updateUserMock = vi.fn();
      vi.mocked(useUser).mockReturnValue({
        clearUser: vi.fn().mockResolvedValue(undefined),
        updateUser: updateUserMock,
        user: null,
        fetchingUser: false,
      } as UserHookReturn);

      const { result } = renderHook(() => useAuth());

      const response = await result.current.register(registerData);

      expect(response).toEqual(mockUserData);
      expect(updateUserMock).toHaveBeenCalledWith(mockUserData);
      expect(toast.success).toHaveBeenCalledWith(
        `Welcome to Recommendable, ${registerData.name}`
      );
    });

    it("should handle register API error with server message", async () => {
      // Create a proper server error that matches the shape expected in the hook
      const errorMessage = "Email already exists";
      const serverError = new Error("API Error") as Error & {
        response: { data: { message: string } };
      };
      // Add the response property to the error object
      serverError.response = {
        data: {
          message: errorMessage,
        },
      };

      // Mock axios instance
      const mockPost = vi.fn().mockRejectedValueOnce(serverError);
      const mockAxiosInstance = { post: mockPost } as unknown as AxiosInstance;

      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      const { result } = renderHook(() => useAuth());

      const registerData = {
        name: "New User",
        email: "existing@example.com",
        password: "password123",
      };

      const response = await result.current.register(registerData);

      expect(response).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it("should handle unexpected register errors", async () => {
      // Mock unexpected API error
      const mockPost = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"));
      const mockAxiosInstance = { post: mockPost } as unknown as AxiosInstance;

      vi.mocked(useAxios).mockReturnValue(mockAxiosInstance);

      const { result } = renderHook(() => useAuth());

      const registerData = {
        name: "New User",
        email: "new@example.com",
        password: "password123",
      };

      const response = await result.current.register(registerData);

      expect(response).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred.");
    });
  });

  describe("logout", () => {
    it("should clear user data and show success message", async () => {
      const clearUserMock = vi.fn().mockResolvedValue(undefined);
      vi.mocked(useUser).mockReturnValue({
        clearUser: clearUserMock,
        updateUser: vi.fn(),
        user: null,
        fetchingUser: false,
      } as UserHookReturn);

      const { result } = renderHook(() => useAuth());

      await result.current.logout();

      expect(clearUserMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("You have been logged out.");
    });
  });
});
