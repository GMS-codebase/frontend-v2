import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Toggle from "../core/toggle";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import FileInput from "../core/FileInput";
import TableInput from "../core/TableInput";
import { Survey } from "@/types/surveys-form";
import RadioInput from "../core/RadioInput";
import CheckboxInput from "../core/CheckBoxInput";

import { useDisclosure } from "@mantine/hooks";
import { authorizedApi } from "@/utils/api";
import { FaDownload } from "react-icons/fa";
import { handleDownloadFile } from "@/services";
import DeleteSurvey from "./RemoveSurvey";

interface CreateSurveyProps {
  survey: Survey;
  onSave: (updatedSurvey: Survey) => void;
}

interface SurveyProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  survey: Survey;
  onAnswer?: (surveyKey: string, answer: any) => void;
  onComment?: (surveyKey: string, comment: any) => void;
  editable: boolean;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
  onChange: (updatedSurvey: Survey) => void;
  deleteSurvey: (surveyId: string) => void;
}

const SurveyComponent: React.FC<SurveyProps> = ({
  mode,
  survey,
  editable,
  deleteSurvey,
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
        <CreateSurvey
          survey={survey}
          onSave={(updatedSurvey: Survey) => {
            setIsEditing(false);
            onChange(updatedSurvey);
          }}
        />
      ) : (
        <ViewSurvey
          survey={survey}
          mode={mode}
          edit={() => setIsEditing(true)}
          answers={answers}
          setAnswers={setAnswers}
          comments={comments}
          deleteSurvey={deleteSurvey}
          setComments={setComments}
        />
      )}
    </div>
  );
};

const CreateSurvey: React.FC<CreateSurveyProps> = ({ survey, onSave }) => {
  const [editingSurvey, setEditingSurvey] = useState(survey);
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
      if (survey.template) {
        await authorizedApi.post("/api/v2/files/delete", {
          folder: survey.id,
          filename: survey.template,
        });
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", survey.id);
      const response = await authorizedApi.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditingSurvey({
        ...editingSurvey,
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
    key: keyof Survey
  ) => {
    const updatedSurvey = { ...editingSurvey, [key]: e.target.value };
    if (key === "type" && e.target.value === "table")
      updatedSurvey.columns = [];
    setEditingSurvey(updatedSurvey);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={editingSurvey.title}
          placeholder="Survey Title"
          onChange={(e) => handleInputChange(e, "title")}
          className="w-2/3 p-3 border rounded-2xl outline-none"
        />
        <select
          value={editingSurvey.type}
          onChange={(e) => handleInputChange(e as any, "type")}
          className="w-1/3 p-3 border rounded-2xl outline-none bg-white"
        >
          <option value="" disabled>
            Select Survey Type
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
          value={editingSurvey.description}
          onChange={(e) => handleInputChange(e, "description")}
          className="w-full p-2 border rounded-2xl outline-none"
          placeholder="Add a description (optional)"
        />
      </div>
      <div className="border-t-2 py-3 w-full overflow-x-auto">
        {renderSurveyType("creating", editingSurvey, {
          onSurveyChange: (survey) => setEditingSurvey(survey),
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
              {selectedFile || editingSurvey.template ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {editingSurvey.template
                      ? editingSurvey.template
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
            {(selectedFile || editingSurvey.template) && (
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
          {editingSurvey.type === "file" && (
            <div className="flex items-center gap-2">
              <label className="block">Show Template Example:</label>
              <Toggle
                value={showingTemplateExample}
                onChange={(value) => {
                  setShowingTemplateExample(value);
                  if (!value)
                    setEditingSurvey({ ...editingSurvey, description: "" });
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
                  setEditingSurvey({ ...editingSurvey, description: "" });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block">Required:</label>
            <Toggle
              value={editingSurvey.required}
              onChange={(value) =>
                setEditingSurvey({ ...editingSurvey, required: value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block">Commentable:</label>
            <Toggle
              value={editingSurvey.commentable}
              onChange={(value) =>
                setEditingSurvey({ ...editingSurvey, commentable: value })
              }
            />
          </div>
        </div>
        <button
          onClick={() => onSave(editingSurvey)}
          className="px-4 py-2 rounded-xl bg-primary text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const renderSurveyType = (
  mode: "creating" | "viewing" | "answering" | "commenting",
  survey: Survey,
  options?: {
    answers?: { [key: string]: any };
    setAnswers?: (key: string, value: any) => void;
    comments?: { [key: string]: any };
    setComments?: (key: string, value: any) => void;
    onSurveyChange?: (survey: Survey) => void;
    isEditing?: boolean;
  }
) => (
  <>
    {survey.type === "text" && (
      <input
        type="text"
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[survey.id] || ""}
        onChange={(e) => options?.setAnswers?.(survey.id, e.target.value)}
        disabled={mode !== "answering"}
      />
    )}
    {survey.type === "paragraph" && (
      <textarea
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[survey.id] || ""}
        onChange={(e) => options?.setAnswers?.(survey.id, e.target.value)}
        disabled={mode !== "answering"}
      />
    )}
    {survey.type === "radio" && (
      <RadioInput
        survey={survey}
        mode={mode}
        value={options?.answers?.[survey.id]}
        onChange={(data) => options?.setAnswers?.(survey.id, data)}
        onQuestionChange={options?.onSurveyChange as any}
      />
    )}
    {survey.type === "checkbox" && (
      <CheckboxInput
        survey={survey}
        mode={mode}
        value={options?.answers?.[survey.id] || []}
        onChange={(data) => options?.setAnswers?.(survey.id, data)}
        onQuestionChange={options?.onSurveyChange as any}
      />
    )}
    {survey.type === "file" && (
      <FileInput
        mode={mode}
        survey={survey}
        onChange={(answer) => options?.setAnswers?.(survey.id, answer)}
        value={options?.answers?.[survey.id]}
        accept=".pdf"
        disabled={mode !== "answering"}
      />
    )}
    {survey.type === "table" && (
      <TableInput
        survey={survey}
        mode={mode}
        value={options?.answers?.[survey.id]}
        onChange={(data) => options?.setAnswers?.(survey.id, data)}
        onQuestionChange={options?.onSurveyChange as any}
        isEditing={mode !== "answering"}
      />
    )}
    {survey.commentable &&
      (options?.comments || options?.setComments) &&
      (mode === "commenting" || "viewing") && (
        <div className="my-2">
          <p>Comment</p>
          <textarea
            className="w-full p-3 border rounded-2xl outline-none"
            value={options?.comments?.[survey.id] || ""}
            onChange={(e) => options?.setComments?.(survey.id, e.target.value)}
            disabled={mode !== "commenting"}
          />
        </div>
      )}
  </>
);

interface ViewSurveyProps {
  survey: Survey;
  mode: "viewing" | "creating" | "answering" | "commenting";
  edit: () => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
  deleteSurvey: (surveyId: string) => void;
}

const ViewSurvey: React.FC<ViewSurveyProps> = ({
  survey,
  mode,
  edit,
  answers,
  comments,
  setAnswers,
  setComments,
  deleteSurvey,
}) => {
  const [
    isOpenDeleteSurvey,
    { open: openDeleteSurvey, close: closeDeleteSurvey },
  ] = useDisclosure(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-10">
        <div>
          <p className="text-gray-900 text-2xl font-semibold">{survey.title}</p>
          <p className="text-gray-600">{survey.description}</p>
        </div>
        {survey.type === "file" && survey.template && (
          <button
            onClick={() => handleDownloadFile(survey.template, survey.id)}
            className={` bg-primary  text-white font-semibold rounded-full  px-5 py-2 flex gap-2 items-center justify-center`}
          >
            <FaDownload />
            <p className="text-sm truncate">Download Template</p>
          </button>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        {renderSurveyType(mode === "creating" ? "viewing" : mode, survey, {
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
          <button onClick={openDeleteSurvey}>
            <MdOutlineDelete className="w-6 h-6 font-bold text-xl" />
          </button>
        </div>
      )}
      <DeleteSurvey
        closeModal={closeDeleteSurvey}
        isOpenModal={isOpenDeleteSurvey}
        survey={survey}
        removeSurvey={() => deleteSurvey(survey.id)}
      />
    </div>
  );
};

export default SurveyComponent;
