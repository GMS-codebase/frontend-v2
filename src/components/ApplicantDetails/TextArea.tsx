import React, { useState, ChangeEvent } from "react";

interface TextAreaProps {
  readOnly?: boolean;
  defaultText?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  readOnly = false,
  defaultText = "",
}) => {
  const [text, setText] = useState<string>(defaultText);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="p-4 w-full">
      <textarea
        id="textarea"
        name="textarea"
        value={text}
        onChange={handleChange}
        rows={4}
        className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-slate-200"
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextArea;
