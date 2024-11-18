"use client";
import React, { useState, useEffect } from "react";
import AddQuestionType from "./AddQuestionsType";
import QuestionType from "./QuestionType"; // Import the new component
import { QuestionForm } from "@/types/questions-form";

const CreateForm: React.FC = () => {
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState(""); // State for form title
  const [activeType, setActiveType] = useState<string>("text"); // Default active type set to 'text'
  const [formData, setFormData] = useState<QuestionForm>();

  const addQuestionType = (newType: { name: string; description: string }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [newType.name]: {
        name: newType.name,
        description: newType.description,
        pages: [{ questions: [] }],
      },
    }));
  };

  const handleSaveForm = () => {
    // Handle form save logic here
    console.log("Form saved with title:", formTitle, formData);
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Enter form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="flex-grow p-2 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSaveForm}
          className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80"
        >
          Save
        </button>
      </div>

      <div className="flex overflow-x-auto py-4 space-x-4 mb-4">
        {Object.values(formData ?? {}).map((type) => (
          <button
            key={type.name}
            onClick={() => setActiveType(type.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors duration-200 ${
              activeType === type.name
                ? "bg-primary text-white"
                : "bg-primary/20 text-gray-700"
            }`}
          >
            {type.name}
          </button>
        ))}
        <button
          onClick={() => setIsAddTypeModalOpen(true)}
          className="flex-shrink-0 px-4 py-2 rounded-full bg-primary/30 text-gray-700 hover:bg-primary/40 transition-colors duration-200"
        >
          + Add Type
        </button>
      </div>

      {activeType && formData && formData[activeType] && (
        <QuestionType
          questionType={activeType}
          onChange={(data: any) => {
            setFormData(data);
          }}
          formData={formData}
        />
      )}

      <AddQuestionType
        isOpen={isAddTypeModalOpen}
        closeModal={() => setIsAddTypeModalOpen(false)}
        onAddType={addQuestionType}
      />
    </div>
  );
};

export default CreateForm;
