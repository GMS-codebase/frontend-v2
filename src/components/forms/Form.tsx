"use client";
import React, { useState, useEffect } from "react";
import AddQuestionType from "./AddQuestionsType";
import QuestionType from "./QuestionType"; // Import the new component
import { Form as IForm } from "@/types/questions-form";
import { IoIosCloseCircle } from "react-icons/io";

interface Props {
  mode: "creating" | "viewing" | "answering" | "commenting";
  formData: IForm;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<IForm | undefined>>;
}
const Form: React.FC<Props> = ({
  mode,
  formData,
  setFormData,
  answers,
  setAnswers,
  comments,
  setComments,
}) => {
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<string | null>();

  const addQuestionType = (newType: { name: string; description: string }) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return;
        console.log(prevFormData);
        return {
          ...prevFormData,
          qns: {
            ...prevFormData.qns,
            [newType.name]: {
              name: newType.name,
              description: newType.description,
              pages: [{ questions: [] }],
            },
          },
        };
      });
  };

  useEffect(() => {
    if (!activeType) {
      const questions = Object.values(formData?.qns ?? {}) as any[];
      setActiveType(questions[0]?.name);
    }
  }, [formData]);

  return (
    <div className="p-4">
      {mode === "creating" && (
        <div className="rounded-xl bg-white ">
          <div className="h-4 bg-primary rounded-t-xl" />
          <div className="p-6">
            <input
              type="text"
              placeholder="Enter form title"
              value={formData?.name}
              disabled={mode !== "creating"}
              onChange={(e) =>
                setFormData &&
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex-grow p-2 text-2xl  focus:outline-none w-full border-b"
            />
          </div>
        </div>
      )}

      <div className="flex overflow-x-auto py-4 space-x-4 mb-4">
        {Object.values(formData?.qns ?? {}).map((type: any) => (
          <div
            key={type.name}
            onClick={() => setActiveType(type.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors duration-200 ${
              activeType === type.name
                ? "bg-primary text-white"
                : "bg-primary/20 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <p>{type.name}</p>
              {mode === "creating" && (
                <button
                  className="text-danger bg-white rounded-full"
                  onClick={() => {
                    setFormData &&
                      setFormData((prevFormData: any) => {
                        if (!prevFormData) return null;
                        const updatedFormData = {
                          ...prevFormData,
                          qns: {
                            ...(typeof prevFormData.qns === "object"
                              ? prevFormData.qns
                              : {}),
                          },
                        };
                        if (typeof updatedFormData.qns === "object") {
                          delete updatedFormData.qns[type.name as any];
                        }
                        return updatedFormData;
                      });
                  }}
                >
                  <IoIosCloseCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        ))}
        {mode === "creating" && (
          <button
            onClick={() => setIsAddTypeModalOpen(true)}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-primary/30 text-gray-700 hover:bg-primary/40 transition-colors duration-200"
          >
            + Add Type
          </button>
        )}
      </div>

      {activeType && formData && formData.qns[activeType as any] && (
        <QuestionType
          mode={mode}
          questionType={activeType}
          answers={answers}
          setAnswers={setAnswers}
          comments={comments}
          setComments={setComments}
          onChange={(data: any) => {
            setFormData &&
              setFormData(
                (prevFormData) =>
                  ({
                    ...prevFormData,
                    qns: {
                      ...(prevFormData?.qns || {}),
                      [activeType]: data,
                    },
                  }) as any,
              );
          }}
          formData={formData.qns}
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

export default Form;
