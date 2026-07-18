import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Find the selected label from children
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value === value) {
        setSelectedLabel(child.props.children);
      }
    });
  }, [value, children]);

  const handleSelect = (newValue: string, label: string) => {
    onValueChange(newValue);
    setSelectedLabel(label);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className="
          relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left 
          border border-gray-300 shadow-sm focus:border-primary-500 focus:outline-none 
          focus:ring-1 focus:ring-primary-500 transition-colors duration-200
        "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-sm">
          {selectedLabel || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div
          className="
          absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 
          shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in
        "
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                onClick: () =>
                  handleSelect(child.props.value, child.props.children),
                isSelected: child.props.value === value,
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const SelectItem: React.FC<
  SelectItemProps & {
    onClick?: () => void;
    isSelected?: boolean;
  }
> = ({ value, children, onClick, isSelected = false }) => {
  return (
    <button
      type="button"
      className={`
        relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm w-full text-left
        hover:bg-primary-50 transition-colors duration-150
        ${isSelected ? "bg-primary-100 text-primary-900" : "text-gray-900"}
      `}
      onClick={onClick}
    >
      <span className="block truncate">{children}</span>
      {isSelected && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
          <svg
            className="h-4 w-4 text-primary-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </button>
  );
};

export { Select, SelectItem };
