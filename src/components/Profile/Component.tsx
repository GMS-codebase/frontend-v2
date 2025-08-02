import { IconType } from "react-icons/lib";

interface ProfileComponentProps {
  label: string;
  inputType: "text" | "number";
  icon: any;
  value: any;
  name: string;
  onChange: (a: any) => void;
  required?: boolean;
  placeholder: string;
  className?: string;
}
const Input = ({
  label,
  inputType,
  icon,
  value,
  name,
  onChange,
  required,
  placeholder,
  className,
}: ProfileComponentProps) => {
  return (
    <div className="w-full flex items-center gap-3">
      <label
        htmlFor={label}
        className="block text-base font-bold text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={
            className +
            " mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          }
          required={required}
        />
      </div>
      {}
    </div>
  );
};
export default Input;
