import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = ({ className, size = "md", ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    >
      <div className="h-full w-full rounded-full border-2 border-t-primary border-r-transparent border-b-primary border-l-transparent" />
    </div>
  );
};
