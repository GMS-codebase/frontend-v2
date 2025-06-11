import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  error?: string;
  type?: 'text' | 'paragraph';
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  label,
  error,
  type = 'text'
}) => {
  const Component = type === 'paragraph' ? 'textarea' : 'input';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Component
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 
          transition-all duration-200 bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${type === 'paragraph' ? 'min-h-[100px] resize-y' : 'h-10'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextInput; 