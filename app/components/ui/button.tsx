import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  size?: "sm" | "icon";
};

export const Button: React.FC<ButtonProps> = ({ children, className = "", variant = "default", size, asChild, ...rest }) => {
  // Use our global CSS classes for consistent styling
  const variantClass = variant === "default" ? "btn" : variant === "secondary" || variant === "outline" ? "btn-secondary" : variant === "ghost" ? "btn-ghost" : variant === "destructive" ? "btn-destructive" : "btn";
  const sizeClass = size === "sm" ? "btn-sm" : size === "icon" ? "btn-icon" : "";
  const cls = `${variantClass} ${sizeClass} ${className}`.trim();

  if (asChild && React.isValidElement(children)) {
    const child = React.cloneElement(children as React.ReactElement, {
      className: `${cls} ${((children as any).props && (children as any).props.className) || ""}`.trim(),
      ...rest,
    });
    return child;
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
};

export default Button;
