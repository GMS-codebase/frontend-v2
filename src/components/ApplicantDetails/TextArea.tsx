import React, { useState, ChangeEvent } from "react";

interface TextAreaProps {
  readOnly?: boolean;
  defaultText?: string;
  name?: string;
  value?: any;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  readOnly,
  defaultText,
  name,
  value,
  onChange,
}) => {
  const [text, setText] = useState<string>(defaultText ?? "");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        id="textarea"
        name={name ?? "textarea"}
        value={value ?? text}
        onChange={onChange ?? handleChange}
        rows={4}
        className={`mt-2 p-2 w-full border-none outline-1 resize-none ${readOnly ? "cursor-not-allowed" : "cursor-pointer"} outline-[#000F2305] rounded-md shadow-sm focus:ring-opacity-50 bg-[#000F2308]`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextArea;
