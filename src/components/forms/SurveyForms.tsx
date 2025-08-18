"use client";
import React, { useState, useEffect, useRef } from "react";
import AddSurveyType from "./AddSurveyType";
import SurveyType from "./SurveyType";
import { IForm, SurveyForm, ESurveyType, Survey } from "@/types/surveys-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import RemoveSurveyType from "./RemoveSurveyType";
import { CiEdit } from "react-icons/ci";
import { IconCalendar } from "@tabler/icons-react";
import { CalendarMinimalistic } from "solar-icon-set";
import { SurveyProvider } from "@/contexts/SurveyContext";

interface Props {
  mode: "creating" | "viewing" | "answering" | "commenting";
  formData: IForm;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<IForm | undefined>>;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  submitLoading?: boolean;
  saveLoading?: boolean;
}

const SurveyForms: React.FC<Props> = ({
  mode,
  formData,
  setFormData,
  answers,
  setAnswers,
  onSaveDraft,
  onSubmit,
  submitLoading,
  saveLoading,
}) => {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState<string | null>(
    null
  );
  const [displayDate, setDisplayDate] = useState<string>("");
  const [
    isOpenDeleteSurveyType,
    { open: openDeleteSurveyType, close: closeDeleteSurveyType },
  ] = useDisclosure(false);
  const [
    isOpenAddSurveyType,
    { open: openAddSurveyType, close: closeAddSurveyType },
  ] = useDisclosure(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Extract all survey questions from the form data for the context
  const getAllSurveyQuestions = (): Survey[] => {
    if (!formData?.qns || typeof formData.qns !== "object") {
      console.log("No form data or qns");
      return [];
    }
    
    const allQuestions: Survey[] = [];
    
    console.log("Form data qns structure:", formData.qns);
    
    Object.entries(formData.qns).forEach(([typeName, surveyType]) => {
      console.log(`Processing survey type: ${typeName}`, surveyType);
      
      if (surveyType.pages) {
        surveyType.pages.forEach((page, pageIndex) => {
          console.log(`Processing page ${pageIndex}:`, page);
          
          if (page.surveys) {
            console.log(`Page ${pageIndex} has ${page.surveys.length} surveys:`, page.surveys);
            allQuestions.push(...page.surveys);
          } else {
            console.log(`Page ${pageIndex} has no surveys`);
          }
        });
      } else {
        console.log(`Survey type ${typeName} has no pages`);
      }
    });
    
    console.log("Final extracted questions:", allQuestions);
    
    return allQuestions;
  };

  const allSurveyQuestions = getAllSurveyQuestions();

  // Update display date when formData changes
  useEffect(() => {
    if (formData?.expiry_date) {
      const date = new Date(formData.expiry_date);
      setDisplayDate(date.toISOString().split("T")[0]);
    } else {
      setDisplayDate("");
    }
  }, [formData?.expiry_date]);

  // Update active type when formData changes
  useEffect(() => {
    if (formData?.qns && typeof formData.qns === "object") {
      const surveyTypes = Object.keys(formData.qns);
      if (surveyTypes.length > 0 && !activeType) {
        setActiveType(surveyTypes[0]);
      }
    }
  }, [formData, activeType]);

  // Test: Add a sample question to see if context works
  useEffect(() => {
    if (allSurveyQuestions.length === 0) {
      console.log("No questions found, this might be the issue");
    }
  }, [allSurveyQuestions]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDisplayDate(newDate);

    if (setFormData) {
      setFormData((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          expiry_date: newDate ? new Date(newDate) : new Date(), // Provide default Date if no date selected
        };
      });
    }
  };

  // Handle icon click to open date picker
  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  // Add a new survey type
  const addSurveyType = (newType: { name: string; description: string }) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;
        const currentQns =
          typeof prevFormData.qns === "object" ? prevFormData.qns : {};
        // Set the new type as active
        setActiveType(newType.name);
        return {
          ...prevFormData,
          qns: {
            ...currentQns,
            [newType.name]: {
              name: newType.name,
              description: newType.description,
              pages: [{ surveys: [] }],
            },
          },
        };
      });
  };

  // Update an existing survey type
  const updateSurveyType = (
    newType: { name: string; description: string },
    recentName: string
  ) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;

        // Ensure qns is an object (SurveyForm)
        const qns =
          typeof prevFormData.qns === "object" ? prevFormData.qns : {};

        if (!qns[recentName]) {
          console.warn(`Survey type with name "${recentName}" not found.`);
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

  // Delete a survey type
  const deleteSurveyType = (name: string) => {
    setFormData &&
      setFormData((prevFormData) => {
        if (!prevFormData) return undefined;

        // Ensure qns is an object (SurveyForm)
        const currentQns =
          typeof prevFormData.qns === "object" ? prevFormData.qns : {};
        const updatedQns = { ...currentQns };
        delete updatedQns[name];

        return {
          ...prevFormData,
          qns: updatedQns,
        };
      });
  };

  // Set the first survey type as active if none is selected
  useEffect(() => {
    if (!activeType && formData?.qns && typeof formData.qns === "object") {
      const surveyTypes = Object.keys(formData.qns);
      setActiveType(surveyTypes[0] ?? null);
    }
  }, [formData, activeType]);

  return (
    <SurveyProvider initialQuestions={allSurveyQuestions}>
      <div className="p-4 w-full">
        
        {mode === "creating" && (
          <div className="rounded-xl bg-white">
            <div className="h-4 bg-primary rounded-t-xl" />
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter Survey title"
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData &&
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="flex-grow p-2 text-2xl focus:outline-none w-full border-b"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-700">
                    Choose expiry date
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200 cursor-pointer"
                      onClick={handleIconClick}
                    >
                      <CalendarMinimalistic size={20} />
                    </span>
                    <input
                      ref={dateInputRef}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={displayDate}
                      onChange={handleDateChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none hover:border-primary/50 transition-colors duration-200"
                      placeholder="Select expiry date"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-700">
                    Survey Dedication
                  </label>
                  <select
                    value={formData?.survey_type || ""}
                    onChange={(e) =>
                      setFormData &&
                      setFormData({
                        ...formData,
                        survey_type: e.target.value as ESurveyType,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 hover:border-primary/50 transition-colors duration-200 bg-white"
                  >
                    <option value="" disabled>
                      Select survey dedication
                    </option>
                    <option value={ESurveyType.TRAINEESURVEY}>
                      Trainee Survey
                    </option>
                    <option value={ESurveyType.COMPANYSURVEY}>
                      Company Survey
                    </option>
                    <option value={ESurveyType.GENERALSURVEY}>
                      General Survey
                    </option>
                  </select>
                </div>

              </div>
            </div>
          </div>
        )}

        <div className="flex overflow-x-auto py-4 space-x-4 mb-4">
          {formData?.qns &&
            typeof formData.qns === "object" &&
            Object.entries(
              formData.qns as {
                [key: string]: {
                  name: string;
                  description: string;
                  pages: { surveys: Survey[] }[];
                };
              }
            ).map(([typeName, type]) => (
              <div
                key={typeName}
                onClick={() => setActiveType(typeName)}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors duration-200 ${
                  activeType === typeName
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
                          activeType === typeName ? "text-white" : "text-primary"
                        } rounded-full`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSurveyType(typeName);
                          openAddSurveyType();
                        }}
                      >
                        <CiEdit className="w-6 h-6" />
                      </button>
                      <button
                        className="text-danger bg-white rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSurveyType(typeName);
                          openDeleteSurveyType();
                        }}
                      >
                        <IoIosCloseCircle className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          {mode === "creating" && (
            <button
              onClick={openAddSurveyType}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-primary/30 text-gray-700 hover:bg-primary/40 transition-colors duration-200"
            >
              + Add Type
            </button>
          )}
        </div>

        {activeType &&
          formData?.qns &&
          typeof formData.qns === "object" &&
          formData.qns[activeType] && (
            <SurveyType
              mode={mode}
              surveyType={activeType}
              answers={answers}
              setAnswers={setAnswers}
              goToNext={
                formData.qns &&
                typeof formData.qns === "object" &&
                Object.keys(formData.qns).length > 1
                  ? Object.keys(formData.qns)[
                      Object.keys(formData.qns).indexOf(activeType) + 1
                    ]
                    ? () =>
                        setActiveType(
                          Object.keys(formData.qns as SurveyForm)[
                            Object.keys(formData.qns as SurveyForm).indexOf(
                              activeType
                            ) + 1
                          ]
                        )
                    : undefined
                  : undefined
              }
              goToPrev={
                formData.qns &&
                typeof formData.qns === "object" &&
                Object.keys(formData.qns).length > 1
                  ? Object.keys(formData.qns)[
                      Object.keys(formData.qns).indexOf(activeType) - 1
                    ]
                    ? () =>
                        setActiveType(
                          Object.keys(formData.qns as SurveyForm)[
                            Object.keys(formData.qns as SurveyForm).indexOf(
                              activeType
                            ) - 1
                          ]
                        )
                    : undefined
                  : undefined
              }
              onChange={(data: SurveyForm[string]) => {
                setFormData &&
                  setFormData((prevFormData) => {
                    if (!prevFormData) return undefined;
                    // Ensure qns is an object (SurveyForm)
                    const currentQns =
                      typeof prevFormData.qns === "object"
                        ? prevFormData.qns
                        : {};
                    return {
                      ...prevFormData,
                      qns: {
                        ...currentQns,
                        [activeType]: data,
                      },
                    };
                  });
              }}
              formData={formData.qns as SurveyForm}
            />
          )}

        <AddSurveyType
          isOpen={isOpenAddSurveyType}
          closeModal={() => {
            setSelectedSurveyType(null);
            closeAddSurveyType();
          }}
          onAddType={addSurveyType}
          onUpdateType={updateSurveyType}
          surveyType={
            selectedSurveyType &&
            formData?.qns &&
            typeof formData.qns === "object"
              ? formData.qns[selectedSurveyType]
              : undefined
          }
        />

        <RemoveSurveyType
          isOpenModal={isOpenDeleteSurveyType}
          closeModal={() => {
            setSelectedSurveyType(null);
            closeDeleteSurveyType();
          }}
          surveyType={selectedSurveyType ?? ""}
          removeSurvey={deleteSurveyType}
        />

        {/* Save and Submit buttons for answering mode */}
        {mode === "answering" && (onSaveDraft || onSubmit) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              {onSaveDraft && (
                <button
                  onClick={onSaveDraft}
                  disabled={saveLoading}
                  className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saveLoading ? "Saving..." : "Save as Draft"}
                </button>
              )}
              {onSubmit && (
                <button
                  onClick={onSubmit}
                  disabled={submitLoading}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? "Submitting..." : "Submit Survey"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </SurveyProvider>
  );
};

export default SurveyForms;
