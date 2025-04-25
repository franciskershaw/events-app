import React, { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useAuth from "@/pages/Auth/hooks/useAuth";

import LocalForm from "./LocalForm";

// Interface definitions for mock components
interface FormProps {
  children: ReactNode;
  onSubmit: (data: Record<string, unknown>) => void;
  form?: Record<string, unknown>;
  [key: string]: unknown;
}

interface FormInputProps {
  name: string;
  label: string;
  children: ReactNode;
  [key: string]: unknown;
}

interface InputProps {
  placeholder: string;
  type?: string;
  id?: string;
  [key: string]: unknown;
}

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  throttleClicks?: boolean;
  [key: string]: unknown;
}

// Mock data for our form submissions
const mockFormData = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
};

// Mock the form components
vi.mock("@/components/ui/form", () => ({
  Form: ({ children, onSubmit }: FormProps) => (
    <form
      data-testid="mock-form"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(mockFormData);
      }}
    >
      {children}
    </form>
  ),
  FormInput: ({ name, label, children }: FormInputProps) => (
    <div data-testid={`form-input-${name}`}>
      <label htmlFor={name}>{label}</label>
      <div id={name}>{children}</div>
    </div>
  ),
}));

// Mock the Input component
vi.mock("@/components/ui/input", () => ({
  Input: ({ placeholder, type, id, ...props }: InputProps) => (
    <input
      data-testid={`input-${placeholder}`}
      id={id}
      placeholder={placeholder}
      type={type || "text"}
      {...props}
    />
  ),
}));

// Mock the Button component
vi.mock("@/components/ui/button", () => {
  return {
    Button: (props: ButtonProps) => {
      // Create a new props object without throttleClicks
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { throttleClicks, ...buttonProps } = props;
      return (
        <button data-testid="submit-button" {...buttonProps}>
          {props.children}
        </button>
      );
    },
  };
});

// Mock the useAuth hook
vi.mock("@/pages/Auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// Mock the form dependencies
vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(() => vi.fn()),
}));

// Create mock implementation for react-hook-form
vi.mock("react-hook-form", () => {
  return {
    useForm: () => ({
      handleSubmit:
        (callback: (data: Record<string, unknown>) => void) =>
        (e: React.FormEvent) => {
          e.preventDefault();
          callback(mockFormData);
        },
      register: vi.fn().mockImplementation((name: string) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
      })),
      formState: { errors: {} },
      clearErrors: vi.fn(),
      reset: vi.fn(),
      setValue: vi.fn(),
      watch: vi.fn(),
    }),
  };
});

describe("LocalForm", () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
    });
  });

  it("renders login form by default", () => {
    render(<LocalForm />);

    // Check for login form elements using testid instead of label
    expect(screen.getByTestId("form-input-email")).toBeInTheDocument();
    expect(screen.getByTestId("form-input-password")).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it("toggles to register form when clicking 'Register'", async () => {
    const user = userEvent.setup();
    render(<LocalForm />);

    // Click on register link
    const registerLink = screen.getByText(/register/i);
    await user.click(registerLink);

    // Should now show register elements using testid
    expect(screen.getByTestId("form-input-name")).toBeInTheDocument();
    expect(
      screen.getByTestId("form-input-confirmPassword")
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toHaveTextContent(/register/i);
  });

  it("toggles back to login form when clicking 'Login'", async () => {
    const user = userEvent.setup();
    render(<LocalForm />);

    // First switch to register
    await user.click(screen.getByText(/register/i));

    // Then switch back to login
    await user.click(screen.getByText(/login/i));

    // Should show login form again
    expect(screen.queryByTestId("form-input-name")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("form-input-confirmPassword")
    ).not.toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toHaveTextContent(/login/i);
  });

  it("calls login function when submitting login form", async () => {
    const user = userEvent.setup();
    render(<LocalForm />);

    // Submit the form
    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    // Login should be called with form data
    expect(mockLogin).toHaveBeenCalledWith({
      email: mockFormData.email,
      password: mockFormData.password,
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("calls register function when submitting register form", async () => {
    const user = userEvent.setup();
    render(<LocalForm />);

    // Toggle to register form
    await user.click(screen.getByText(/register/i));

    // Submit the form
    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    // Register should be called with form data
    expect(mockRegister).toHaveBeenCalledWith({
      name: mockFormData.name,
      email: mockFormData.email,
      password: mockFormData.password,
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
