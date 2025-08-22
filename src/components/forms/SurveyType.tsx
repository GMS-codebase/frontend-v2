import React, { useState } from "react";
import SurveyComponent from "./Survey";
import { Survey as ISurvey, SurveyForm } from "@/types/surveys-form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { shouldShowQuestion } from "@/utils/surveyConditionalLogic";
import { useSurveyContext } from "@/contexts/SurveyContext";

interface SurveyTypeProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  surveyType: string;
  formData: SurveyForm;
  onChange: (updatedFormData: any) => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  goToNext?: () => void;
  goToPrev?: () => void;
}

const SurveyType: React.FC<SurveyTypeProps> = ({
  mode,
  surveyType,
  formData,
  onChange,
  answers,
  setAnswers,
  goToNext,
  goToPrev,
}) => {
  const [newSurvey, setNewSurvey] = useState<ISurvey>({
    id: uuid(),
    title: "Question Title",
    description: "Question SubTitle",
    type: "number",
    required: false,
    commentable: false,
    name: "Question Title",
    survey_TYPE: surveyType,
  });

  const { addQuestion, removeQuestion } = useSurveyContext();

  // Get all surveys from all pages and flatten them
  const getAllSurveys = (): ISurvey[] => {
    const surveyTypeData = formData[surveyType];
    if (!surveyTypeData?.pages) return [];
    
    return surveyTypeData.pages.reduce((allSurveys: ISurvey[], page) => {
      return allSurveys.concat(page.surveys || []);
    }, []);
  };

  const allSurveys = getAllSurveys();

  const handleAddSurvey = (survey: ISurvey) => {
    // Create a new page with the survey if no pages exist
    const currentPages = formData[surveyType]?.pages || [];
    let updatedPages;
    
    if (currentPages.length === 0) {
      // Create first page with the new survey
      updatedPages = [{ surveys: [survey] }];
    } else {
      // Add to the first page
      updatedPages = [...currentPages];
      updatedPages[0] = {
        ...updatedPages[0],
        surveys: [...(updatedPages[0].surveys || []), survey]
      };
    }

    const updatedFormData = {
      ...formData[surveyType],
      pages: updatedPages,
    };

    onChange(updatedFormData);
    
    // Add to context for conditional logic
    addQuestion(survey);
    
    setNewSurvey({
      id: uuid(),
      title: "Question Title",
      description: "Question SubTitle",
      type: "number",
      required: false,
      commentable: false,
      name: "Question Title",
      survey_TYPE: surveyType,
    });
  };

  const handleSurveyChange = (updatedSurvey: ISurvey) => {
    const updatedPages = formData[surveyType]?.pages?.map(page => ({
      ...page,
      surveys: page.surveys?.map(s => s.id === updatedSurvey.id ? updatedSurvey : s) || []
    })) || [];

    onChange({
      ...formData[surveyType],
      pages: updatedPages,
    });
    
    // Update in context for conditional logic
    addQuestion(updatedSurvey);
  };

  const deleteSurvey = (surveyId: string) => {
    const updatedPages = formData[surveyType]?.pages?.map(page => ({
      ...page,
      surveys: page.surveys?.filter(s => s.id !== surveyId) || []
    })) || [];

    onChange({
      ...formData[surveyType],
      pages: updatedPages,
    });
    
    // Remove from context for conditional logic
    removeQuestion(surveyId);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || mode !== "creating") return;

    const reorderedSurveys = [...allSurveys];
    const [removed] = reorderedSurveys.splice(result.source.index, 1);
    reorderedSurveys.splice(result.destination.index, 0, removed);

    // Update the first page with reordered surveys
    const updatedPages = [{ surveys: reorderedSurveys }];
    
    onChange({
      ...formData[surveyType],
      pages: updatedPages,
    });
  };

  // Filter questions based on conditional logic when in answering mode
  const visibleSurveys = mode === "answering" 
    ? allSurveys.filter(survey => shouldShowQuestion(survey, answers || {}, allSurveys))
    : allSurveys;

  return (
    <div className="space-y-6">
      {mode === "creating" && (
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Questions for {surveyType}</h3>
            <span className="text-sm text-gray-500">
              {allSurveys.length} questions added
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddSurvey(newSurvey)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              <IoMdAddCircleOutline className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>
      )}

      {allSurveys.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No questions added yet</p>
          <p className="text-sm">Click &quot;Add Question&quot; to start building your survey</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="surveys" isDropDisabled={mode !== "creating"}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {visibleSurveys.map((survey, index) => (
                  <Draggable
                    key={survey.id}
                    draggableId={survey.id}
                    index={index}
                    isDragDisabled={mode !== "creating"}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${
                          snapshot.isDragging ? "opacity-50" : ""
                        }`}
                      >
                        <SurveyComponent
                          mode={mode}
                          survey={survey}
                          editable={mode === "creating"}
                          deleteSurvey={deleteSurvey}
                          onChange={handleSurveyChange}
                          answers={answers}
                          setAnswers={setAnswers}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Navigation buttons for multiple survey types */}
      {(goToNext || goToPrev) && (
        <div className="flex items-center gap-2 justify-end mt-6 pt-4 border-t">
          {goToPrev && (
            <button
              onClick={goToPrev}
              className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Previous Type
            </button>
          )}
          
          {goToNext && (
            <button
              onClick={goToNext}
              className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Next Type
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyType;
