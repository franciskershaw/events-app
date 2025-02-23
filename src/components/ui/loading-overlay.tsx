import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  fullPage?: boolean;
  className?: string;
}

export const LoadingOverlay = ({
  fullPage = false,
  className,
}: LoadingOverlayProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background/50 backdrop-blur-[1px]",
        fullPage ? "fixed inset-0 z-50" : "absolute inset-0",
        className
      )}
    >
      <div className="bg-background/50 p-4 rounded-full">
        <Spinner size="lg" />
      </div>
    </div>
  );
};
