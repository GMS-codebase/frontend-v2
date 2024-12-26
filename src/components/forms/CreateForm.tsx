"use client";
import React, { useState, useEffect } from "react";
import AddQuestionType from "./AddQuestionsType";
import QuestionType from "./QuestionType"; // Import the new component
import { QuestionForm } from "@/types/questions-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { ADD_FORM_SUCCESS, UPDATE_FORM_SUCCESS } from "@/actions/FormsActions";

const CreateForm: React.FC = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [activeType, setActiveType] = useState<string>("text");
  const [formData, setFormData] = useState<QuestionForm>();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const forms = useSelector((state: any) => state.forms);

  const existingForm = forms.forms.find((form: any) => form.uuid === id);

  useEffect(() => {
    if (existingForm) {
      setFormTitle(existingForm.name);
      setFormData(JSON.parse(existingForm.qns));
    }
    setPageLoading(false);
  }, [existingForm, id]);

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
    setLoading(true);
    const request = existingForm
      ? authorizedApi.put(`/forms/update/${id}`, {
          name: formTitle,
          qns: JSON.stringify(formData),
        })
      : authorizedApi.post("/forms/create", {
          name: formTitle,
          qns: JSON.stringify(formData),
        });

    request
      .then((res) => {
        notifications.show({
          message: existingForm
            ? "Question Form  is updated successfully"
            : "Question Form  is created successfully",
          color: "blue",
        });

        dispatch({
          type: existingForm ? UPDATE_FORM_SUCCESS : ADD_FORM_SUCCESS,
          payload: res.data?.data,
        });
        router.back();
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage = err.response.data.message;
          if (errorMessage && errorMessage.includes("duplicate key")) {
            notifications.show({
              message: `Failed to ${
                existingForm ? "update" : "create"
              } form. It seems a form with similar details already exists.`,
              color: "red",
            });
          } else {
            notifications.show({
              message:
                errorMessage ??
                `Failed to ${existingForm ? "update" : "create"} form! Please try again.`,
              color: "red",
            });
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-800">
        Loading...
      </div>
    );
  }

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
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80"
        >
          {loading ? "Loading.." : "Save"}
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
