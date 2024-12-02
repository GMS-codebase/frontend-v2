import React from "react";

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => {
  const handleToggle = () => {
    onChange(!value);
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative w-12 h-6 flex items-center cursor-pointer rounded-full transition-colors ${
        value ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          value ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default Toggle;
