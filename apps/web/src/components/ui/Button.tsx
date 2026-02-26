import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-violet-600 hover:bg-violet-500 text-white",
        secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
        ghost: "hover:bg-zinc-800 text-zinc-300",
        danger: "bg-red-600 hover:bg-red-500 text-white",
        outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-300",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-xl",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={clsx(button({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
