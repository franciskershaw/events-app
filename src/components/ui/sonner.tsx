import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group toast group-[.toaster]:bg-primary-lightest group-[.toaster]:text-foreground group-[.toaster]:border-success group-[.toaster]:border-l-4 group-[.toaster]:border-l-success group-[.toaster]:shadow-lg",
          error:
            "group toast group-[.toaster]:bg-destructive-light group-[.toaster]:text-foreground group-[.toaster]:border-destructive group-[.toaster]:border-l-4 group-[.toaster]:border-l-destructive group-[.toaster]:shadow-lg",
          warning:
            "group toast group-[.toaster]:bg-destructive-light group-[.toaster]:text-foreground group-[.toaster]:border-destructive-light group-[.toaster]:border-l-4 group-[.toaster]:border-l-destructive-light group-[.toaster]:shadow-lg",
          info: "group toast group-[.toaster]:bg-primary-lightest group-[.toaster]:text-foreground group-[.toaster]:border-primary-light group-[.toaster]:border-l-4 group-[.toaster]:border-l-primary group-[.toaster]:shadow-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
