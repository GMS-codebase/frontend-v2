import React from 'react';

interface CheckboxInputProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  label?: string;
  error?: string;
  questionId?: string; // Add questionId prop
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  options,
  value,
  onChange,
  required,
  label,
  error,
  questionId
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
            className={`flex items-center gap-3 cursor-pointer group p-3 rounded-lg border-2 transition-all duration-200 ${
              value.includes(option)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <input
                type="checkbox"
                name={`${questionId || `checkbox-${Math.random()}`}-${index}`} // Use questionId as base name
                checked={value.includes(option)}
                onChange={() => handleChange(option)}
                className="w-5 h-5 border-2 border-gray-300 rounded appearance-none cursor-pointer
                  checked:bg-primary checked:border-primary transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {value.includes(option) && (
                <svg
                  className="absolute top-0.5 left-0.5 w-4 h-4 pointer-events-none text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className={`font-medium transition-colors ${
              value.includes(option) ? 'text-primary' : 'text-gray-700 group-hover:text-gray-900'
            }`}>
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
