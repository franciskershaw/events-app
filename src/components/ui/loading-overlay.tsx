import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  fullPage?: boolean;
  className?: string;
  message?: string;
  opacity?: "light" | "medium" | "dark";
  spinnerSize?: "sm" | "md" | "lg";
}

export const LoadingOverlay = ({
  fullPage = false,
  className,
  message,
  opacity = "medium",
  spinnerSize = "lg",
}: LoadingOverlayProps) => {
  // Map opacity names to actual values
  const opacityValues = {
    light: "bg-background/30",
    medium: "bg-background/50",
    dark: "bg-background/70",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center backdrop-blur-[1px]",
        opacityValues[opacity],
        fullPage ? "fixed inset-0 z-50" : "absolute inset-0",
        className
      )}
    >
      <div
        className={cn("bg-background/50 p-4 rounded-full", message && "mb-3")}
      >
        <Spinner size={spinnerSize} />
      </div>

      {message && (
        <div className="text-center px-4 py-2 bg-background/70 rounded-md text-sm font-medium">
          {message}
        </div>
      )}

      <span className="sr-only">Loading</span>
    </div>
  );
};
