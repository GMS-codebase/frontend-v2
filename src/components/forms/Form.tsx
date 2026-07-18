"use client";
import React, { useState, useEffect } from "react";
import AddQuestionType from "./AddQuestionsType";
import QuestionType from "./QuestionType";
import { Form as IForm } from "@/types/questions-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import RemoveQuestionType from "./RemoveQuestionType";
import { CiEdit } from "react-icons/ci";

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
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    string | null
  >(null);
  const [
    isOpenDeleteQuestionType,
    { open: openDeleteQuestionType, close: closeDeleteQuestionType },
  ] = useDisclosure(false);
  const [
    isOpenAddQuestionType,
    { open: openAddQuestionType, close: closeAddQuestionType },
  ] = useDisclosure(false);

  const addQuestionType = (newType: { name: string; description: string }) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;
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
  const updateQuestionType = (
    newType: { name: string; description: string },
    recentName: string
  ) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;
        const { qns } = prevFormData;
        if (!qns[recentName]) {
          console.warn(`Question type with name "${recentName}" not found.`);
          return prevFormData;
        }
        const updatedQns = { ...qns };
        delete updatedQns[recentName];
        updatedQns[newType.name] = {
          ...qns[recentName],
          name: newType.name,
          description: newType.description,
        };
        return {
          ...prevFormData,
          qns: updatedQns,
        };
      });
  };

  const deleteQuestionType = (name: string) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;
        const updatedFormData = {
          ...prevFormData,
          qns: {
            ...prevFormData.qns,
          },
        };
        delete updatedFormData.qns[name];
        return updatedFormData;
      });
  };

  useEffect(() => {
    if (!activeType) {
      const questions = Object.values(formData?.qns ?? {}) as any[];
      setActiveType(questions[0]?.name ?? null);
    }
  }, [activeType]);

  return (
    <div className="p-4 w-full">
      {mode === "creating" && (
        <div className="rounded-xl bg-white">
          <div className="h-4 bg-primary rounded-t-xl" />
          <div className="p-6">
            <input
              type="text"
              placeholder="Enter form title"
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex-grow p-2 text-2xl focus:outline-none w-full border-b"
            />
          </div>
        </div>
      )}

      <div className="flex overflow-x-auto py-4 space-x-4 mb-4">
        {Object.values(formData?.qns ?? {}).map(
          (type: any, index: number, array) => (
            <div
              key={type.name}
              onClick={() => setActiveType(type.name)}
              className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors duration-200 ${
                activeType === type.name
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <p>{type.name}</p>
                {mode === "creating" && (
                  <>
                    <button
                      className={`${
                        activeType === type.name
                          ? "text-white "
                          : "text-primary"
                      } rounded-full`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuestionType(type);
                        openAddQuestionType();
                      }}
                    >
                      <CiEdit className="w-6 h-6" />
                    </button>
                    <button
                      className="text-danger bg-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuestionType(type.name);
                        openDeleteQuestionType();
                      }}
                    >
                      <IoIosCloseCircle className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}
        {mode === "creating" && (
          <button
            onClick={openAddQuestionType}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-primary/30 text-gray-700 hover:bg-primary/40 transition-colors duration-200"
          >
            + Add Type
          </button>
        )}
      </div>

      {activeType && formData?.qns[activeType] && (
        <QuestionType
          mode={mode}
          questionType={activeType}
          answers={answers}
          setAnswers={setAnswers}
          comments={comments}
          setComments={setComments}
          goToNext={
            Object.keys(formData.qns)[
              Object.keys(formData.qns).indexOf(activeType) + 1
            ]
              ? () =>
                  setActiveType(
                    Object.keys(formData.qns)[
                      Object.keys(formData.qns).indexOf(activeType) + 1
                    ]
                  )
              : undefined
          }
          goToPrev={
            Object.keys(formData.qns)[
              Object.keys(formData.qns).indexOf(activeType) - 1
            ]
              ? () =>
                  setActiveType(
                    Object.keys(formData.qns)[
                      Object.keys(formData.qns).indexOf(activeType) - 1
                    ]
                  )
              : undefined
          }
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
                  }) as any
              );
          }}
          formData={formData.qns}
        />
      )}

      <AddQuestionType
        isOpen={isOpenAddQuestionType}
        closeModal={() => {
          setSelectedQuestionType(null);
          closeAddQuestionType();
        }}
        onAddType={addQuestionType}
        onUpdateType={updateQuestionType}
        questionType={selectedQuestionType}
      />

      <RemoveQuestionType
        isOpenModal={isOpenDeleteQuestionType}
        closeModal={() => {
          setSelectedQuestionType(null);
          closeDeleteQuestionType();
        }}
        questionType={selectedQuestionType as any}
        removeQuestion={deleteQuestionType}
      />
    </div>
  );
};

export default Form;
