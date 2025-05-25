import { Question } from "@/types/questions-form";
import { Survey } from "@/types/surveys-form";
import React, { useEffect, useState } from "react";

interface CheckboxInputProps {
  question?: Question;
  survey? : Survey;
  value: string[];
  onChange: (value: string[]) => void;
  onQuestionChange: (updatedQuestion: Question | Survey) => void;
  mode: "creating" | "viewing" | "answering" | "commenting";
  disabled?: boolean;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  question,
  survey,
  value,
  onChange,
  onQuestionChange,
  mode,
  disabled,
}) => {
  const data = question || survey;
  const [choices, setChoices] = useState<string[]>(data?.choices || []);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleAddChoice = () => {
    if(!data) return;
   setChoices([...choices, ""]);
   onQuestionChange({...data, choices: [...choices]});
  };

  const handleChoiceChange = (index: number, newChoice: string) => {
   if(!data) return;
   const updatedChoices = [...choices];
   updatedChoices[index] = newChoice;
   setChoices(updatedChoices);
   onQuestionChange({...data, choices: updatedChoices});
  };

  const handleCheckboxToggle = (toggledValue: string) => {
    console.log(value);
    const updatedValue = value?.includes(toggledValue)
      ? value.filter((val) => val !== toggledValue)
      : [...value, toggledValue];
    console.log(updatedValue);
    onChange(updatedValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Choices:
        </label>
        <div className="space-y-2 mt-2">
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={choice}
                checked={value?.includes(choice)}
                onChange={() => handleCheckboxToggle(choice)}
                // disabled={mode !== "answering"}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                disabled={mode !== "creating" || disabled}
                placeholder="Enter choice"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          {mode === "creating" && (
            <button
              type="button"
              onClick={handleAddChoice}
              className="mt-2 bg-primary py-3 px-10 mb-5 text-white rounded-xl focus:outline-none"
            >
              + Add Choice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckboxInput;
