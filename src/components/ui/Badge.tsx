import React from "react";

interface BadgeProps {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  children,
  className = "",
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const variantClasses = {
    default: "bg-primary-100 text-primary-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
