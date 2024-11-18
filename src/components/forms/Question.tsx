import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineFileAdd } from "react-icons/ai";

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: "text" | "paragraph" | "file" | "table";
  required: boolean;
  commentable: boolean;
  file?: File | null; // To hold file data for file type questions
}

interface QuestionProps {
  question: Question;
  onAnswer?: (questionKey: string, answer: any) => void;
  onComment?: (questionKey: string, comment: any) => void;
  editable: boolean;
  onChange: (updatedQuestion: Question) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  editable,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-4 bg-white border rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {isEditing ? "Edit Question" : question.title}
        </h3>
        {editable && !isEditing && (
          <AiOutlineEdit
            className="cursor-pointer text-primary"
            size={24}
            onClick={handleEditToggle}
          />
        )}
      </div>

      {isEditing ? (
        <CreateQuestion
          question={question}
          onSave={onChange}
          setIsEditing={setIsEditing}
        />
      ) : (
        <ViewQuestion question={question} />
      )}
    </div>
  );
};

interface CreateQuestionProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({
  question,
  setIsEditing,
  onSave,
}) => {
  const [editingQuestion, setEditingQuestion] = useState(question);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof Question
  ) => {
    const updatedQuestion = { ...editingQuestion, [key]: e.target.value };
    setEditingQuestion(updatedQuestion);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const updatedQuestion = { ...editingQuestion, file: e.target.files[0] };
      setEditingQuestion(updatedQuestion);
    }
  };

  const handleSave = () => {
    onSave(editingQuestion);
    setIsEditing && setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block">Title:</label>
        <input
          type="text"
          value={editingQuestion.title}
          onChange={(e) => handleInputChange(e, "title")}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block">Subtitle:</label>
        <input
          type="text"
          value={editingQuestion.subtitle}
          onChange={(e) => handleInputChange(e, "subtitle")}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block">Type:</label>
        <select
          value={editingQuestion.type}
          onChange={(e) => handleInputChange(e as any, "type")}
          className="w-full p-2 border rounded"
        >
          <option value="text">Text</option>
          <option value="paragraph">Paragraph</option>
          <option value="file">File</option>
          <option value="table">Table</option>
        </select>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={editingQuestion.required}
            onChange={(e) => handleInputChange(e, "required")}
            className="mr-2"
          />
          Required
        </label>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={editingQuestion.commentable}
            onChange={(e) => handleInputChange(e, "commentable")}
            className="mr-2"
          />
          Commentable
        </label>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-full"
      >
        Save Changes
      </button>
    </div>
  );
};

interface ViewQuestionProps {
  question: Question;
}

const ViewQuestion: React.FC<ViewQuestionProps> = ({ question }) => {
  return (
    <div className="space-y-2">
      <p className="text-gray-600">{question.subtitle}</p>
      {question.type === "text" && (
        <input type="text" className="w-full p-2 border rounded" />
      )}
      {question.type === "paragraph" && (
        <textarea className="w-full p-2 border rounded" />
      )}
      {question.type === "file" && (
        <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
          <label
            htmlFor={`file-upload-${question.id}`}
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
          >
            <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">+</span>
            </div>
            {question.file ? (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700">
                  {question.file?.name}
                </p>
                <p className="text-sm text-gray-500">File selected</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-md text-gray-500">Upload file</p>
                <p className="text-md text-gray-400">or drag and drop</p>
              </div>
            )}
          </label>
          <input
            id={`file-upload-${question.id}`}
            name="file-upload"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export { QuestionComponent, CreateQuestion, ViewQuestion };
