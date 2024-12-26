import React, { useState } from "react";
import { CreateQuestion, QuestionComponent } from "./Question";
import { Question as IQuestion } from "@/types/questions-form";

interface QuestionsPageProps {
  pageIndex: number;
  questionType: string;
  pageQuestions: IQuestion[];
  onChange: (updatedQuestions: IQuestion[]) => void;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({
  pageIndex,
  questionType,
  pageQuestions,
  onChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState<IQuestion>({
    id: `${questionType}-q-${pageIndex}-${pageQuestions?.length}`,
    title: "Question Title",
    subtitle: "Question SubTitle",
    type: "text",
    required: false,
    commentable: false,
  });
  const handleAddQuestion = (question: any) => {
    onChange([question, ...pageQuestions]);
    setNewQuestion({
      id: `${questionType}-q-${pageIndex}-${pageQuestions?.length}`,
      title: "Question Title",
      subtitle: "Question SubTitle",
      type: "text",
      required: false,
      commentable: false,
    });
  };

  const handleQuestionChange = (updatedQuestion: IQuestion) => {
    const updatedQuestions = pageQuestions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q,
    );
    onChange(updatedQuestions);
  };

  return (
    <div className="p-4 bg-white border rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold ">
          Page {pageIndex + 1}: Questions
        </h3>
        <button
          onClick={() => {
            setIsAdding(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-full"
        >
          Add Question
        </button>
      </div>
      <div className="space-y-4">
        {isAdding && (
          <CreateQuestion
            question={newQuestion as any}
            onSave={handleAddQuestion}
            setIsEditing={setIsAdding}
          />
        )}
        {pageQuestions.map((question, index) => (
          <QuestionComponent
            key={question.id}
            question={question}
            editable={true} // Set to true if you want it to be editable
            onChange={handleQuestionChange}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
