import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    const baseStyles = "w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-jade focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed";
    const borderStyles = error
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-brand-jade";

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
