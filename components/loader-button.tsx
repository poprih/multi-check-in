import { Loader } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

interface LoaderButtonProps extends ButtonProps {
  loading?: boolean;
}
export default function LoaderButton({
  children,
  loading = false,
  ...rest
}: LoaderButtonProps) {
  return (
    <Button
      {...rest}
      className="flex gap-1"
      disabled={rest.disabled || loading}
    >
      {loading && <Loader className="animate-spin-slow" size={16} />}
      {children}
    </Button>
  );
}
