import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Toggle from "../core/toggle";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { Survey, ConditionalLogic } from "@/types/surveys-form";
import RadioInput from "../core/RadioInput";
import CheckboxInput from "../core/CheckBoxInput";

import { useDisclosure } from "@mantine/hooks";
import { authorizedApi } from "@/utils/api";
import { FaDownload } from "react-icons/fa";
import { handleDownloadFile } from "@/services";
import DeleteSurvey from "./RemoveSurvey";
import { submitSurvey, checkSurveyStatus } from "@/services/api/survey";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import { useSurveyContext } from "@/contexts/SurveyContext";
import FileInput from "../core/FileInput";
import TableInput from "../core/TableInput";

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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteSurvey(survey.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      ref={containerRef}
      className={`flex-grow w-full overflow-hidden p-4 bg-white border rounded-lg mb-6 relative ${
        isEditing ? "border-l-4 border-l-primary" : ""
      }`}
    >
      {editable && (
        <div className="flex justify-end items-center gap-2 mb-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-primary transition-colors duration-200 bg-white rounded-full shadow"
            title="Edit Question"
          >
            <CiEdit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200 bg-white rounded-full shadow"
            title="Delete Question"
          >
            <IoIosCloseCircle className="w-5 h-5" />
          </button>
        </div>
      )}
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
          deleteSurvey={deleteSurvey}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteSurvey
          isOpenModal={showDeleteConfirm}
          closeModal={() => setShowDeleteConfirm(false)}
          removeSurvey={() => confirmDelete()}
          survey={survey}
        />
      )}
    </div>
  );
};

const CreateSurvey: React.FC<CreateSurveyProps> = ({ survey, onSave }) => {
  const [editingSurvey, setEditingSurvey] = useState(survey);
  const [showingDescription, setShowingDescription] = useState(true);

  // Get available questions from context
  const { getDependencyOptions, availableQuestions } = useSurveyContext();
  const [selectedDependencyQuestion, setSelectedDependencyQuestion] = useState<any>(null);

  // Get available questions for dependency selection
  const availableQuestionsForDependency = getDependencyOptions(survey.id);

  // Debug: Log available questions
  useEffect(() => {
    console.log("Available questions in context:", availableQuestions);
    console.log("Available questions for dependency:", availableQuestionsForDependency);
  }, [availableQuestions, availableQuestionsForDependency]);

  // Update selected dependency question when dependency changes
  useEffect(() => {
    if (editingSurvey.conditionalLogic?.dependsOn) {
      const question = availableQuestionsForDependency.find(q => q.value === editingSurvey.conditionalLogic?.dependsOn);
      setSelectedDependencyQuestion(question);
    } else {
      setSelectedDependencyQuestion(null);
    }
  }, [editingSurvey.conditionalLogic?.dependsOn, availableQuestionsForDependency]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof Survey
  ) => {
    const updatedSurvey = { ...editingSurvey, [key]: e.target.value };
    setEditingSurvey(updatedSurvey);
  };

  const handleConditionalLogicChange = (field: keyof ConditionalLogic, value: any) => {
    setEditingSurvey(prev => ({
      ...prev,
      conditionalLogic: {
        ...prev.conditionalLogic,
        [field]: value,
      } as ConditionalLogic,
    }));
  };

  const handleConditionalLogicShowWhenChange = (field: keyof ConditionalLogic['showWhen'], value: any) => {
    setEditingSurvey(prev => ({
      ...prev,
      conditionalLogic: {
        ...prev.conditionalLogic,
        showWhen: {
          ...prev.conditionalLogic?.showWhen,
          [field]: value,
        },
      } as ConditionalLogic,
    }));
  };

  const toggleConditionalLogic = () => {
    if (!editingSurvey.conditionalLogic?.enabled) {
      setEditingSurvey(prev => ({
        ...prev,
        conditionalLogic: {
          enabled: true,
          dependsOn: "",
          showWhen: {
            operator: "equals",
            value: "",
          },
        },
      }));
    } else {
      setEditingSurvey(prev => ({
        ...prev,
        conditionalLogic: undefined,
      }));
    }
  };

  // Get available operators based on the selected dependency question type
  const getAvailableOperators = () => {
    if (!selectedDependencyQuestion) return [];

    switch (selectedDependencyQuestion.type) {
      case "number":
        return [
          { value: "equals", label: "equals" },
          { value: "not_equals", label: "does not equal" },
          { value: "greater_than", label: "greater than" },
          { value: "less_than", label: "less than" },
        ];
      case "radio":
        return [
          { value: "equals", label: "equals" },
          { value: "not_equals", label: "does not equal" },
        ];
      case "checkbox":
        return [
          { value: "contains", label: "contains" },
          { value: "not_contains", label: "does not contain" },
        ];
      default:
        return [];
    }
  };

  // Render value input based on the selected dependency question type
  const renderValueInput = () => {
    if (!selectedDependencyQuestion) {
      return (
        <input
          type="text"
          value={String(editingSurvey.conditionalLogic?.showWhen?.value || "")}
          onChange={(e) => handleConditionalLogicShowWhenChange("value", e.target.value)}
          placeholder="Select a question first"
          className="p-2 border rounded text-sm bg-gray-100"
          disabled
        />
      );
    }

    switch (selectedDependencyQuestion.type) {
      case "number":
        return (
          <input
            type="number"
            value={String(editingSurvey.conditionalLogic?.showWhen?.value || "")}
            onChange={(e) => handleConditionalLogicShowWhenChange("value", e.target.value)}
            placeholder="Enter number"
            className="p-2 border rounded text-sm"
          />
        );
      case "radio":
        return (
          <select
            value={String(editingSurvey.conditionalLogic?.showWhen?.value || "")}
            onChange={(e) => handleConditionalLogicShowWhenChange("value", e.target.value)}
            className="p-2 border rounded text-sm"
          >
            <option value="">Select an option</option>
            {selectedDependencyQuestion.choices?.map((choice: string) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <select
            value={String(editingSurvey.conditionalLogic?.showWhen?.value || "")}
            onChange={(e) => handleConditionalLogicShowWhenChange("value", e.target.value)}
            className="p-2 border rounded text-sm"
          >
            <option value="">Select an option</option>
            {selectedDependencyQuestion.choices?.map((choice: string) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={String(editingSurvey.conditionalLogic?.showWhen?.value || "")}
            onChange={(e) => handleConditionalLogicShowWhenChange("value", e.target.value)}
            placeholder="Enter value"
            className="p-2 border rounded text-sm"
          />
        );
    }
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
          <option value="number">Number</option>
          <option value="radio">Radio Choices</option>
          <option value="checkbox">Checkbox Choices</option>
        </select>
      </div>

      <div>
        <textarea
          value={editingSurvey.description}
          onChange={(e) => handleInputChange(e, "description")}
          className="w-full p-2 border rounded-2xl outline-none"
          placeholder="Add a description (optional)"
        />
        {/* Choices input for radio/checkbox */}
        {(editingSurvey.type === "radio" ||
          editingSurvey.type === "checkbox") && (
          <div className="mb-4">
            <label className="block font-medium mb-2">Choices</label>
            {Array.isArray(editingSurvey.choices) &&
              editingSurvey.choices.length > 0 && (
                <ul className="mb-2">
                  {editingSurvey.choices.map((choice, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => {
                          const newChoices = [...(editingSurvey.choices || [])];
                          newChoices[idx] = e.target.value;
                          setEditingSurvey({
                            ...editingSurvey,
                            choices: newChoices,
                          });
                        }}
                        className="p-2 border rounded"
                      />
                      <button
                        type="button"
                        className="text-red-500 px-2"
                        onClick={() => {
                          const newChoices = [...(editingSurvey.choices || [])];
                          newChoices.splice(idx, 1);
                          setEditingSurvey({
                            ...editingSurvey,
                            choices: newChoices,
                          });
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            <button
              type="button"
              className="bg-primary text-white px-3 py-1 rounded"
              onClick={() => {
                setEditingSurvey({
                  ...editingSurvey,
                  choices: [...(editingSurvey.choices || []), ""],
                });
              }}
            >
              + Add Choice
            </button>
          </div>
        )}
      </div>

      {/* Conditional Logic Section */}
      <div className="border-t-2 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Conditional Logic</h3>
          <button
            type="button"
            onClick={toggleConditionalLogic}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              editingSurvey.conditionalLogic?.enabled
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {editingSurvey.conditionalLogic?.enabled ? "Disable" : "Enable"}
          </button>
        </div>
        
        {editingSurvey.conditionalLogic?.enabled && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {availableQuestionsForDependency.length === 0 ? (
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded border border-orange-200">
                <strong>No questions available:</strong> You need to create at least one question before setting up conditional logic.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    This question will be shown when:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={editingSurvey.conditionalLogic?.showWhen?.operator || "equals"}
                      onChange={(e) => handleConditionalLogicShowWhenChange("operator", e.target.value)}
                      className="p-2 border rounded text-sm"
                    >
                      {getAvailableOperators().map(operator => (
                        <option key={operator.value} value={operator.value}>
                          {operator.label}
                        </option>
                      ))}
                    </select>
                    
                    {renderValueInput()}
                    
                    <select
                      value={editingSurvey.conditionalLogic?.dependsOn || ""}
                      onChange={(e) => handleConditionalLogicChange("dependsOn", e.target.value)}
                      className="p-2 border rounded text-sm"
                    >
                      <option value="">Select question... ({availableQuestionsForDependency.length} available)</option>
                      {availableQuestionsForDependency.map(question => (
                        <option key={question.value} value={question.value}>
                          {question.label} ({question.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {selectedDependencyQuestion && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Selected Question:</strong> {selectedDependencyQuestion.label} ({selectedDependencyQuestion.type})
                    {selectedDependencyQuestion.choices && (
                      <div className="mt-1">
                        <strong>Available options:</strong> {selectedDependencyQuestion.choices.join(", ")}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <strong>Example:</strong> This question will be shown when &quot;{selectedDependencyQuestion?.label || 'Question 1'}&quot; {editingSurvey.conditionalLogic?.showWhen?.operator || 'equals'} &quot;{editingSurvey.conditionalLogic?.showWhen?.value || 'value'}&quot;
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="border-t-2 py-3 w-full overflow-x-auto">
        {renderSurveyType("creating", editingSurvey, {
          onSurveyChange: (survey) => setEditingSurvey(survey),
          isEditing: true,
        })}
      </div>

      <div className="border-t-2 pt-3 flex justify-end gap-3">
        <div className="flex items-center gap-2">
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
        disabled={!options?.setAnswers}
      />
    )}
    {survey.type === "paragraph" && (
      <textarea
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[survey.id] || ""}
        onChange={(e) => options?.setAnswers?.(survey.id, e.target.value)}
        disabled={!options?.setAnswers}
      />
    )}
    {survey.type === "number" && (
      <input
        type="number"
        className="w-full p-3 border rounded-2xl outline-none"
        value={options?.answers?.[survey.id] || ""}
        onChange={(e) => options?.setAnswers?.(survey.id, e.target.value)}
        disabled={mode !== "answering"}
        placeholder="Enter a number"
      />
    )}
    {survey.type === "radio" && (
      <RadioInput
        options={survey.choices || []}
        value={options?.answers?.[survey.id] || ""}
        onChange={(value) => options?.setAnswers?.(survey.id, value)}
        required={survey.required}
        label={survey.description || "Select an option"}
        questionId={survey.id}
      />
    )}
    {survey.type === "checkbox" && (
      <CheckboxInput
        options={survey.choices || []}
        value={options?.answers?.[survey.id] || []}
        onChange={(value) => options?.setAnswers?.(survey.id, value)}
        required={survey.required}
        label={survey.description || "Select options"}
        questionId={survey.id}
      />
    )}
  </>
);

interface ViewSurveyProps {
  survey: Survey;
  mode: "viewing" | "creating" | "answering" | "commenting";
  edit: () => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  deleteSurvey: (surveyId: string) => void;
}

const ViewSurvey: React.FC<ViewSurveyProps> = ({
  survey,
  mode,
  edit,
  answers,
  setAnswers,
  deleteSurvey,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const { getQuestionById } = useSurveyContext();

  useEffect(() => {
    const checkAnswered = async () => {
      if (survey.id && user?.id) {
        try {
          const status = await checkSurveyStatus(Number(survey.id), user.id);
          setIsAnswered(status.answered);
        } catch (error) {
          console.error("Error checking survey status:", error);
        }
      }
    };
    checkAnswered();
  }, [survey.id, user?.id]);

  // Get the dependent question title for display
  const getDependentQuestionTitle = (questionId: string) => {
    const dependentQuestion = getQuestionById(questionId);
    return dependentQuestion?.title || `Question ${questionId}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      notifications.show({
        title: "Authentication Required",
        message: "Please log in to submit the survey",
        color: "red",
      });
      return;
    }

    if (!answers || Object.keys(answers).length === 0) {
      notifications.show({
        title: "Validation Error",
        message: "Please answer at least one question",
        color: "red",
      });
      return;
    }

    // Check required fields
    const requiredFields = Object.entries(survey).filter(
      ([_, value]) => value.required
    );
    const missingRequired = requiredFields.some(([key]) => !answers[key]);
    if (missingRequired) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill in all required fields",
        color: "red",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSurvey({
        surveyId: Number(survey.id),
        userId: user.id,
        userName: `${user.firstname} ${user.lastname}`,
        answers: JSON.stringify(answers),
      });
      notifications.show({
        title: "Success",
        message: "Survey submitted successfully",
        color: "green",
      });
      setIsAnswered(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
      notifications.show({
        title: "Error",
        message: "Failed to submit survey. Please try again.",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{survey.title}</h2>
        {mode === "creating" && (
          <div className="flex gap-2">
            <button
              onClick={edit}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <FiEdit3 size={20} />
            </button>
            <button
              onClick={() => deleteSurvey(survey.id)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <MdOutlineDelete size={20} />
            </button>
          </div>
        )}
      </div>

      {survey.description && (
        <p className="text-gray-600 text-sm">{survey.description}</p>
      )}

      {/* Show conditional logic information */}
      {survey.conditionalLogic?.enabled && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Conditional Logic:</strong> This question will be shown when the answer to &quot;
            {getDependentQuestionTitle(survey.conditionalLogic.dependsOn)}&quot; {survey.conditionalLogic.showWhen.operator} &quot;
            {survey.conditionalLogic.showWhen.value}&quot;
          </p>
        </div>
      )}

      <div className="space-y-6">
        {renderSurveyType(mode, survey, {
          answers,
          setAnswers,
        })}
      </div>
    </div>
  );
};

export default SurveyComponent;
