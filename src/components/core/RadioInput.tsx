import React from 'react';

interface RadioInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  error?: string;
  questionId?: string; // Add questionId prop
}

const RadioInput: React.FC<RadioInputProps> = ({
  options,
  value,
  onChange,
  required,
  label,
  error,
  questionId
}) => {
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
              value === option
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <input
                type="radio"
                name={questionId || `radio-${Math.random()}`} // Use questionId as name to prevent conflicts
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 border-2 border-gray-300 rounded-full appearance-none cursor-pointer
                  checked:border-primary checked:border-6 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {value === option && (
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-primary rounded-full"></div>
              )}
            </div>
            <span className={`font-medium transition-colors ${
              value === option ? 'text-primary' : 'text-gray-700 group-hover:text-gray-900'
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

export default RadioInput;
