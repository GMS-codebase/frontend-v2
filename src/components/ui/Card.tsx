import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
      bg-white rounded-xl border border-gray-200 shadow-sm 
      hover:shadow-md transition-shadow duration-200
      ${paddingClasses[padding]} ${className}
    `}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export { Card, CardHeader, CardContent, CardTitle };
