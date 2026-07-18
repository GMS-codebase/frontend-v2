import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClasses = align === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`
          absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5
          animate-fade-in ${alignmentClasses}
        `}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={`
        w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
        transition-colors duration-150 flex items-center
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Dropdown, DropdownItem };
