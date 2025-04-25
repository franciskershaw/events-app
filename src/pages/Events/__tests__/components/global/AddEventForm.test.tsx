import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { FieldValues, UseFormReturn, UseFormWatch } from "react-hook-form";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import AddEventForm from "@/pages/Events/components/global/EventModals/AddEventForm";
import useEventForm from "@/pages/Events/hooks/useEventForm";

// Define a basic form value type for testing
interface FormValues extends FieldValues {
  title: string;
  datetime: Date;
  endDatetime?: Date;
  unConfirmed: boolean;
  private: boolean;
  category: string;
  venue?: string;
  city?: string;
  description?: string;
  recurrence: {
    isRecurring: boolean;
    pattern?: {
      frequency: string;
      interval: number;
      startDate: Date;
      endDate?: Date;
    };
  };
}

// Define watch value types
type WatchValues = {
  "recurrence.isRecurring": boolean;
  unConfirmed: boolean;
  private: boolean;
  category: string;
  datetime: Date;
  "recurrence.pattern.frequency": string;
  [key: string]: unknown;
};

// Mock the useEventForm hook
vi.mock("@/pages/Events/hooks/useEventForm");

// Mock Form component
vi.mock("@/components/ui/form", () => ({
  Form: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <form id={id} data-testid="form">
      {children}
    </form>
  ),
  FormDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-description">{children}</div>
  ),
  FormInput: ({
    name,
    label,
    children,
    className,
  }: {
    name: string;
    label: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  ),
}));

// Mock UI components
vi.mock("@/components/ui/combobox", () => ({
  Combobox: () => <div data-testid="combobox" />,
}));

vi.mock("@/components/ui/date-time", () => ({
  DateTime: ({ onChange }: { onChange: (date: Date | null) => void }) => (
    <button onClick={() => onChange(new Date())} role="button">
      Date Picker
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: () => <input data-testid="input" />,
}));

vi.mock("@/components/ui/loading-overlay", () => ({
  LoadingOverlay: () => <div data-testid="loading-overlay" />,
}));

vi.mock("@/components/ui/switch", () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <button
      data-testid="switch"
      onClick={() => onCheckedChange(!checked)}
      aria-checked={checked}
    >
      Toggle
    </button>
  ),
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: () => <textarea data-testid="textarea" />,
}));

describe("AddEventForm", () => {
  const formId = "test-form-id";
  let mockForm: Partial<UseFormReturn<FormValues>>;
  let mockWatch: Mock<(name: string) => unknown>;

  beforeEach(() => {
    // Create a mock watch function
    mockWatch = vi.fn((name: string) => {
      const watchValues: WatchValues = {
        "recurrence.isRecurring": false,
        unConfirmed: false,
        private: false,
        category: "",
        datetime: dayjs().toDate(),
        "recurrence.pattern.frequency": "monthly",
      };
      return watchValues[name] || "";
    });

    // Create a mock form object with common form methods
    mockForm = {
      setValue: vi.fn(),
      watch: mockWatch as unknown as UseFormWatch<FormValues>,
      handleSubmit: vi.fn((fn) => fn),
    };

    // Set up default hook implementation
    (useEventForm as Mock).mockReturnValue({
      form: mockForm,
      mode: "add",
      onSubmit: vi.fn(),
      eventCategorySelectOptions: [
        { label: "Work", value: "work" },
        { label: "Personal", value: "personal" },
      ],
      recurringFrequencySelectOptions: [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Yearly", value: "yearly" },
      ],
      copiedFromId: null,
      isSubmitting: false,
    });
  });

  it("renders the form with all basic fields", () => {
    render(<AddEventForm formId={formId} />);

    // Check that the form has the correct ID attribute
    expect(screen.getByTestId("form")).toBeInTheDocument();

    // Check for labels of main form fields
    expect(screen.getByText(/Title\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date\*/i)).toBeInTheDocument();
    expect(screen.getByText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Category\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
    expect(screen.getByText(/Description/i)).toBeInTheDocument();

    // Check for toggle switches
    expect(screen.getByText(/Unconfirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Private/i)).toBeInTheDocument();
    expect(screen.getByText(/Recurring/i)).toBeInTheDocument();
  });

  it("does not show recurring fields by default", () => {
    render(<AddEventForm formId={formId} />);

    // Recurring fields should not be visible initially
    expect(screen.queryByText(/Frequency\*/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recurrence End Date/i)).not.toBeInTheDocument();
  });

  it("shows recurring fields when recurring is enabled", () => {
    // Mock the watch function to return true for 'recurrence.isRecurring'
    mockWatch = vi.fn((name: string) => {
      const watchValues: WatchValues = {
        "recurrence.isRecurring": true,
        unConfirmed: false,
        private: false,
        category: "",
        datetime: dayjs().toDate(),
        "recurrence.pattern.frequency": "monthly",
      };
      return watchValues[name] || "";
    });

    mockForm.watch = mockWatch as unknown as UseFormWatch<FormValues>;

    render(<AddEventForm formId={formId} />);

    // Recurring fields should be visible
    expect(screen.getByText(/Frequency\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Recurrence End Date/i)).toBeInTheDocument();
  });

  it("shows loading overlay when submitting", () => {
    // Mock the hook to indicate form is submitting
    (useEventForm as Mock).mockReturnValue({
      form: mockForm,
      mode: "add",
      onSubmit: vi.fn(),
      eventCategorySelectOptions: [],
      recurringFrequencySelectOptions: [],
      copiedFromId: null,
      isSubmitting: true,
    });

    render(<AddEventForm formId={formId} />);

    // Check for loading overlay
    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
  });

  it("shows copy info when form is in copy mode", () => {
    // Mock the hook to indicate form is in copy mode
    (useEventForm as Mock).mockReturnValue({
      form: mockForm,
      mode: "copy",
      onSubmit: vi.fn(),
      eventCategorySelectOptions: [],
      recurringFrequencySelectOptions: [],
      copiedFromId: "some-id", // Set a non-null copiedFromId
      isSubmitting: false,
    });

    render(<AddEventForm formId={formId} />);

    // Check for copy description text
    expect(
      screen.getByText(/This event was copied from another event./i)
    ).toBeInTheDocument();
  });

  it("shows connection copy info when form is in copyFromConnection mode", () => {
    // Mock the hook to indicate form is in copyFromConnection mode
    (useEventForm as Mock).mockReturnValue({
      form: mockForm,
      mode: "copyFromConnection",
      onSubmit: vi.fn(),
      eventCategorySelectOptions: [],
      recurringFrequencySelectOptions: [],
      copiedFromId: "some-id", // Set a non-null copiedFromId
      isSubmitting: false,
    });

    render(<AddEventForm formId={formId} />);

    // Check for copyFromConnection specific text
    expect(
      screen.getByText(
        /This will create a linked copy of your connection's event/i
      )
    ).toBeInTheDocument();
  });

  it("handles toggle interactions", () => {
    render(<AddEventForm formId={formId} />);

    // Find toggle switches
    const switches = screen.getAllByTestId("switch");

    // Assuming 3 switches in the order: Unconfirmed, Private, Recurring
    const unconfirmedSwitch = switches[0];
    const privateSwitch = switches[1];
    const recurringSwitch = switches[2];

    // Toggle each switch and verify setValue was called
    fireEvent.click(unconfirmedSwitch);
    expect(mockForm.setValue).toHaveBeenCalledWith(
      "unConfirmed",
      true,
      expect.anything()
    );

    fireEvent.click(privateSwitch);
    expect(mockForm.setValue).toHaveBeenCalledWith(
      "private",
      true,
      expect.anything()
    );

    fireEvent.click(recurringSwitch);
    expect(mockForm.setValue).toHaveBeenCalledWith(
      "recurrence",
      { isRecurring: true },
      expect.anything()
    );
  });

  it("has the correct form id", () => {
    render(<AddEventForm formId={formId} />);

    // Check that the form has the correct ID attribute
    expect(screen.getByTestId("form")).toHaveAttribute("id", formId);
  });

  it("shows both info messages in copyFromConnection mode", () => {
    // Mock the hook to indicate form is in copyFromConnection mode
    (useEventForm as Mock).mockReturnValue({
      form: mockForm,
      mode: "copyFromConnection",
      onSubmit: vi.fn(),
      eventCategorySelectOptions: [],
      recurringFrequencySelectOptions: [],
      copiedFromId: "some-id",
      isSubmitting: false,
    });

    render(<AddEventForm formId={formId} />);

    // Check both messages are shown
    expect(
      screen.getByText(
        /This will create a linked copy of your connection's event/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /If you change the start date, they'll be treated as separate/i
      )
    ).toBeInTheDocument();
  });

  it("passes datetime value when the date input changes", () => {
    render(<AddEventForm formId={formId} />);

    // Find the date picker buttons
    const datePickerButtons = screen.getAllByRole("button", {
      name: "Date Picker",
    });

    // Click on the first date picker (Start Date)
    fireEvent.click(datePickerButtons[0]);

    // Check that setValue was called with a date
    expect(mockForm.setValue).toHaveBeenCalledWith(
      "datetime",
      expect.any(Date)
    );
  });
});
