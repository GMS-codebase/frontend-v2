import React from 'react';

interface CheckboxInputProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  label?: string;
  error?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  options,
  value,
  onChange,
  required,
  label,
  error
}) => {
  const handleChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => handleChange(option)}
                className="w-5 h-5 border-2 border-gray-300 rounded appearance-none cursor-pointer
                  checked:bg-primary checked:border-primary transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <svg
                className={`absolute top-0.5 left-0.5 w-4 h-4 pointer-events-none
                  ${value.includes(option) ? 'opacity-100' : 'opacity-0'}
                  transition-opacity duration-200`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CheckboxInput;
