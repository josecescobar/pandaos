import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignInButton({
  children = "Sign in",
  className,
  size = "default",
  variant = "default",
  showArrow = false,
  to = "/login",
  ...props
}: ButtonProps & { showArrow?: boolean; to?: string }) {
  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      <Link to={to}>
        {children}
        {showArrow ? <ArrowUpRight className="h-4 w-4" /> : null}
      </Link>
    </Button>
  );
}
