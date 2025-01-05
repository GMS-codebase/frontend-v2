import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Toggle from "../core/toggle";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import FileInput from "../core/FileInput";
import TableInput from "../core/TableInput";
import { Question } from "@/types/questions-form";
import RadioInput from "../core/RadioInput";
import CheckboxInput from "../core/CheckBoxInput";
import DeleteQuestion from "./RemoveQuestion";
import { useDisclosure } from "@mantine/hooks";
import { authorizedApi } from "@/utils/api";
import { FaDownload } from "react-icons/fa";
import { handleDownloadFile } from "@/services";

interface CreateQuestionProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
}

interface QuestionProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  question: Question;
  onAnswer?: (questionKey: string, answer: any) => void;
  onComment?: (questionKey: string, comment: any) => void;
  editable: boolean;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
  onChange: (updatedQuestion: Question) => void;
  deleteQuestion: (questionId: string) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  mode,
  question,
  editable,
  deleteQuestion,
  onChange,
  answers,
  setAnswers,
  comments,
  setComments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={` flex-grow w-full overflow-hidden p-4 bg-white border rounded-lg mb-6 ${
        isEditing ? "border-l-4 border-l-primary" : ""
      }`}
    >
      {isEditing ? (
        <CreateQuestion
          question={question}
          onSave={(updatedQuestion: Question) => {
            setIsEditing(false);
            onChange(updatedQuestion);
          }}
        />
      ) : (
        <ViewQuestion
          question={question}
          mode={mode}
          edit={() => setIsEditing(true)}
          answers={answers}
          setAnswers={setAnswers}
          comments={comments}
          deleteQuestion={deleteQuestion}
          setComments={setComments}
        />
      )}
    </div>
  );
};

const CreateQuestion: React.FC<CreateQuestionProps> = ({
  question,
  onSave,
}) => {
  const [editingQuestion, setEditingQuestion] = useState(question);
  const [showingDescription, setShowingDescription] = useState(true);
  const [showingTemplateExample, setShowingTemplateExample] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    setSelectedFile(file);
    setIsUploading(true);
    try {
      if (question.template) {
        await authorizedApi.post("/api/v2/files/delete", {
          folder: question.id,
          filename: question.template,
        });
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", question.id);
      const response = await authorizedApi.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditingQuestion({
        ...editingQuestion,
        template: response.data.data.data,
      });
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof Question,
  ) => {
    const updatedQuestion = { ...editingQuestion, [key]: e.target.value };
    if (key === "type" && e.target.value === "table")
      updatedQuestion.columns = [];
    setEditingQuestion(updatedQuestion);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={editingQuestion.title}
          placeholder="Question Title"
          onChange={(e) => handleInputChange(e, "title")}
          className="w-2/3 p-3 border rounded-2xl outline-none"
        />
        <select
          value={editingQuestion.type}
          onChange={(e) => handleInputChange(e as any, "type")}
          className="w-1/3 p-3 border rounded-2xl outline-none bg-white"
        >
          <option value="" disabled>
            Select Question Type
          </option>
          <option value="text">Text</option>
          <option value="paragraph">Paragraph</option>
          <option value="radio">Radio Choices</option>
          <option value="checkbox">Checkbox Choices</option>
          <option value="file">File</option>
          <option value="table">Table</option>
        </select>
      </div>

      <div>
        <textarea
          value={editingQuestion.description}
          onChange={(e) => handleInputChange(e, "description")}
          className="w-full p-2 border rounded-2xl outline-none"
          placeholder="Add a description (optional)"
        />
      </div>
      <div className="border-t-2 py-3 w-full overflow-x-auto">
        {renderQuestionType("creating", editingQuestion, {
          onQuestionChange: (question) => setEditingQuestion(question),
          isEditing: true,
        })}
      </div>
      {showingTemplateExample && (
        <div className="border-t-2 py-3 w-full overflow-x-auto">
          <p className="text-sm text-gray-900">Template</p>
          <div
            className={`flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl `}
          >
            <label
              htmlFor="template-upload"
              className={`flex flex-col items-center justify-center space-y-2 cursor-pointer `}
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {selectedFile || editingQuestion.template ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {editingQuestion.template
                      ? editingQuestion.template
                      : selectedFile?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isUploading ? "Uploading..." : "File selected"}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-md text-gray-500">Upload file</p>
                  <p className="text-md text-gray-400">or drag and drop</p>
                </div>
              )}
            </label>
            <input
              id="template-upload"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files)}
            />
            {(selectedFile || editingQuestion.template) && (
              <button
                onClick={() => setSelectedFile(null)}
                className="mt-4 bg-gray-200 text-black font-semibold rounded-full px-4 py-2"
              >
                Select Another File
              </button>
            )}
          </div>
        </div>
      )}

      <div className="border-t-2 pt-3 flex justify-end gap-3">
        <div className="flex items-center gap-2">
          {editingQuestion.type === "file" && (
            <div className="flex items-center gap-2">
              <label className="block">Show Template Example:</label>
              <Toggle
                value={showingTemplateExample}
                onChange={(value) => {
                  setShowingTemplateExample(value);
                  if (!value)
                    setEditingQuestion({ ...editingQuestion, description: "" });
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="block">Show Description:</label>
            <Toggle
              value={showingDescription}
              onChange={(value) => {
                setShowingDescription(value);
                if (!value)
                  setEditingQuestion({ ...editingQuestion, description: "" });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block">Required:</label>
            <Toggle
              value={editingQuestion.required}
              onChange={(value) =>
                setEditingQuestion({ ...editingQuestion, required: value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block">Commentable:</label>
            <Toggle
              value={editingQuestion.commentable}
              onChange={(value) =>
                setEditingQuestion({ ...editingQuestion, commentable: value })
              }
            />
          </div>
        </div>
        <button
          onClick={() => onSave(editingQuestion)}
          className="px-4 py-2 rounded-xl bg-primary text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const renderQuestionType = (
  mode: "creating" | "viewing" | "answering" | "commenting",
  question: Question,
  options?: {
    answers?: { [key: string]: any };
    setAnswers?: (key: string, value: any) => void;
    comments?: { [key: string]: any };
    setComments?: (key: string, value: any) => void;
    onQuestionChange?: (question: Question) => void;
    isEditing?: boolean;
  },
) => (
  <>
    {question.type === "text" && (
      <input
        type="text"
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[question.id] || ""}
        onChange={(e) => options?.setAnswers?.(question.id, e.target.value)}
        disabled={!options?.setAnswers}
      />
    )}
    {question.type === "paragraph" && (
      <textarea
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[question.id] || ""}
        onChange={(e) => options?.setAnswers?.(question.id, e.target.value)}
        disabled={!options?.setAnswers}
      />
    )}
    {question.type === "radio" && (
      <RadioInput
        question={question}
        mode={mode}
        value={options?.answers?.[question.id]}
        onChange={(data) => options?.setAnswers?.(question.id, data)}
        onQuestionChange={options?.onQuestionChange as any}
      />
    )}
    {question.type === "checkbox" && (
      <CheckboxInput
        question={question}
        mode={mode}
        value={options?.answers?.[question.id] || []}
        onChange={(data) => options?.setAnswers?.(question.id, data)}
        onQuestionChange={options?.onQuestionChange as any}
      />
    )}
    {question.type === "file" && (
      <FileInput
        mode={mode}
        question={question}
        onChange={(answer) => options?.setAnswers?.(question.id, answer)}
        value={options?.answers?.[question.id]}
        accept=".pdf"
        disabled={!options?.setAnswers}
      />
    )}
    {question.type === "table" && (
      <TableInput
        question={question}
        mode={mode}
        value={options?.answers?.[question.id]}
        onChange={(data) => options?.setAnswers?.(question.id, data)}
        onQuestionChange={options?.onQuestionChange as any}
        isEditing={options?.isEditing}
      />
    )}
    {question.commentable &&
      (options?.comments || options?.setComments) &&
      (mode === "commenting" || "viewing") && (
        <div className="my-2">
          <p>Comment</p>
          <textarea
            className="w-full p-3 border rounded-2xl outline-none"
            value={options?.comments?.[question.id] || ""}
            onChange={(e) =>
              options?.setComments?.(question.id, e.target.value)
            }
            disabled={!options?.setComments}
          />
        </div>
      )}
  </>
);

interface ViewQuestionProps {
  question: Question;
  mode: "viewing" | "creating" | "answering" | "commenting";
  edit: () => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
  deleteQuestion: (questionId: string) => void;
}

const ViewQuestion: React.FC<ViewQuestionProps> = ({
  question,
  mode,
  edit,
  answers,
  comments,
  setAnswers,
  setComments,
  deleteQuestion,
}) => {
  const [
    isOpenDeleteQuestion,
    { open: openDeleteQuestion, close: closeDeleteQuestion },
  ] = useDisclosure(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-10">
        <div>
          <p className="text-gray-900 text-2xl font-semibold">
            {question.title}
          </p>
          <p className="text-gray-600">{question.description}</p>
        </div>
        {question.type === "file" && question.template && (
          <button
            onClick={() => handleDownloadFile(question.template, question.id)}
            className={` bg-primary  text-white font-semibold rounded-full  px-5 py-2 flex gap-2 items-center justify-center`}
          >
            <FaDownload />
            <p className="text-sm truncate">Download Template</p>
          </button>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        {renderQuestionType(mode === "creating" ? "viewing" : mode, question, {
          answers,
          setAnswers,
          comments,
          setComments,
          isEditing: false,
        })}
      </div>
      {mode === "creating" && (
        <div className="border-t-2 pt-3 flex justify-end gap-3">
          <button onClick={edit} className="">
            <FiEdit3 className="w-6 h-6 font-bold text-xl" />
          </button>
          <button onClick={openDeleteQuestion}>
            <MdOutlineDelete className="w-6 h-6 font-bold text-xl" />
          </button>
        </div>
      )}
      <DeleteQuestion
        closeModal={closeDeleteQuestion}
        isOpenModal={isOpenDeleteQuestion}
        question={question}
        removeQuestion={() => deleteQuestion(question.id)}
      />
    </div>
  );
};

export default QuestionComponent;
