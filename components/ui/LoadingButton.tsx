import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LoadingButton({
  loading,
  loadingText = "Loading...",
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={`relative ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-4" />
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {loading && <span className="opacity-100">{loadingText}</span>}
    </Button>
  );
}
