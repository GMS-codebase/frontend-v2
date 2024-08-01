import React from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  className,
  onClick,
  children,
  type = "button",
  disabled = false,
  loading = false,
}) => {
  const baseStyles =
    "p-2 px-5 rounded-full focus:outline-none disabled:cursor-not-allowed";
  let variantStyles = "";

  if (variant === "primary") {
    variantStyles = "bg-primary text-white";
  } else if (variant === "secondary") {
    variantStyles = " text-primary bg-white";
  } else if (variant === "danger") {
    variantStyles = "bg-danger text-white ";
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
