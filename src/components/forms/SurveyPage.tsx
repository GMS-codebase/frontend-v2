import React, { useEffect, useState } from "react";
import Survey from "./Survey";
import { Survey as ISurvey } from "@/types/surveys-form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineDocumentAdd } from "react-icons/hi";

interface SurveyPageProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  pageIndex: number;
  surveyType: string;
  pageSurveys: ISurvey[];
  onChange: (updatedSurveys: ISurvey[]) => void;
  onAddPage: () => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
}

const SurveyPage: React.FC<SurveyPageProps> = ({
  mode,
  pageIndex,
  surveyType,
  pageSurveys,
  onChange,
  answers,
  setAnswers,
  comments,
  setComments,
}) => {
  const [newSurvey, setNewSurvey] = useState<ISurvey>({
    id: `${surveyType}-s-${pageIndex}-${pageSurveys?.length}`,
    title: "Question Title",
    description: "Question SubTitle",
    type: "text",
    required: false,
    commentable: false,
    name: "Question Title",
    survey_TYPE: surveyType,
  });

  const handleAddSurvey = (survey: ISurvey) => {
    onChange([...pageSurveys, survey]);
    setNewSurvey({
      id: `${surveyType}-s-${pageIndex}-${pageSurveys?.length + 1}`,
      title: "Question Title",
      description: "Question SubTitle",
      type: "text",
      required: false,
      commentable: false,
      name: "Question Title",
      survey_TYPE: surveyType,
    });
  };

  const handleSurveyChange = (updatedSurvey: ISurvey) => {
    const updatedSurveys = pageSurveys?.map((s) =>
      s.id === updatedSurvey.id ? updatedSurvey : s
    );
    onChange(updatedSurveys);
  };

  const deleteSurvey = (surveyId: string) => {
    const updatedSurveys = pageSurveys?.filter((s) => s.id !== surveyId);
    onChange(updatedSurveys);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || mode !== "creating") return;

    const reorderedSurveys = [...pageSurveys];
    const [removed] = reorderedSurveys.splice(result.source.index, 1);
    reorderedSurveys.splice(result.destination.index, 0, removed);

    onChange(reorderedSurveys);
  };

  return (
    <div className="space-y-6">
      {mode === "creating" && (
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
            <span className="text-sm text-gray-500">
              {pageSurveys?.length || 0} questions added
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAddSurvey(newSurvey)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Question
            </button>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="surveys-list" type="group">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 relative"
            >
              {pageSurveys?.map((survey, index) => (
                <Draggable
                  key={survey.id}
                  draggableId={survey.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(mode === "creating" && provided.dragHandleProps)}
                      className="flex justify-center gap-5"
                    >
                      <Survey
                        mode={mode}
                        key={survey.id}
                        survey={survey}
                        editable={mode === "creating"}
                        onChange={handleSurveyChange}
                        deleteSurvey={deleteSurvey}
                        answers={answers}
                        setAnswers={setAnswers}
                        comments={comments}
                        setComments={setComments}
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
    </div>
  );
};

export default SurveyPage;
