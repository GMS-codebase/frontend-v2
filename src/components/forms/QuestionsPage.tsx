import React, { useEffect, useState } from "react";
import Question from "./Question";
import { Question as IQuestion } from "@/types/questions-form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineDocumentAdd } from "react-icons/hi";

interface QuestionsPageProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  pageIndex: number;
  questionType: string;
  pageQuestions: IQuestion[];
  onChange: (updatedQuestions: IQuestion[]) => void;
  onAddPage: () => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({
  mode,
  pageIndex,
  questionType,
  pageQuestions,
  onChange,
  answers,
  setAnswers,
  comments,
  setComments,
}) => {
  const [newQuestion, setNewQuestion] = useState<IQuestion>({
    id: `${questionType}-q-${pageIndex}-${pageQuestions?.length}`,
    title: "Question Title",
    description: "Question SubTitle",
    type: "text",
    required: false,
    commentable: false,
  });

  const handleAddQuestion = (question: IQuestion) => {
    onChange([...pageQuestions, question]);
    setNewQuestion({
      id: `${questionType}-q-${pageIndex}-${pageQuestions?.length + 1}`,
      title: "Question Title",
      description: "Question SubTitle",
      type: "text",
      required: false,
      commentable: false,
    });
  };

  const handleQuestionChange = (updatedQuestion: IQuestion) => {
    const updatedQuestions = pageQuestions?.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q,
    );
    onChange(updatedQuestions);
  };

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = pageQuestions?.filter((q) => q.id !== questionId);
    onChange(updatedQuestions);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || mode !== "creating") return;

    const reorderedQuestions = [...pageQuestions];
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);

    onChange(reorderedQuestions);
  };

  return (
    <div>
      {mode === "creating" && (
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => handleAddQuestion(newQuestion)}
            className="px-4 py-2 bg-primary text-white rounded-full"
          >
            Add Question
          </button>
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions-list" type="group">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 relative "
            >
              {pageQuestions?.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(mode === "creating" && provided.dragHandleProps)}
                      className="flex justify-center gap-5"
                    >
                      <Question
                        mode={mode}
                        key={question.id}
                        question={question}
                        editable={mode === "creating"}
                        onChange={handleQuestionChange}
                        deleteQuestion={deleteQuestion}
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

export default QuestionsPage;
