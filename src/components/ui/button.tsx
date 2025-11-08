import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-brand-primary text-brand-accent hover:bg-brand-primaryHover shadow-sm hover:shadow-md",
      secondary: "bg-brand-surface text-brand-accent hover:bg-brand-primary/80 shadow-sm hover:shadow-md",
      outline: "border-2 border-brand-accentMuted text-brand-primary hover:bg-brand-accent/40 hover:border-brand-accent focus:ring-brand-accent",
  ghost: "text-brand-accent hover:bg-brand-primary/20 hover:text-brand-accent focus:ring-brand-accent",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm hover:shadow-md",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
