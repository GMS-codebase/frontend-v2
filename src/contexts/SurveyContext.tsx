import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Survey } from "@/types/surveys-form";

interface SurveyContextType {
  availableQuestions: Survey[];
  addQuestion: (question: Survey) => void;
  updateQuestion: (questionId: string, updatedQuestion: Survey) => void;
  removeQuestion: (questionId: string) => void;
  getQuestionById: (questionId: string) => Survey | undefined;
  getDependencyOptions: (currentQuestionId: string) => { value: string; label: string; type: string; choices?: string[] }[];
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }
  return context;
};

interface SurveyProviderProps {
  children: ReactNode;
  initialQuestions?: Survey[];
  allSurveyQuestions?: Survey[];
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ 
  children, 
  initialQuestions = [],
  allSurveyQuestions = []
}) => {
  const [availableQuestions, setAvailableQuestions] = useState<Survey[]>([...initialQuestions, ...allSurveyQuestions]);

  // Update available questions when allSurveyQuestions changes
  useEffect(() => {
    setAvailableQuestions([...initialQuestions, ...allSurveyQuestions]);
  }, [initialQuestions, allSurveyQuestions]);

  const addQuestion = (question: Survey) => {
    setAvailableQuestions(prev => [...prev, question]);
  };

  const updateQuestion = (questionId: string, updatedQuestion: Survey) => {
    setAvailableQuestions(prev => 
      prev.map(q => q.id === questionId ? updatedQuestion : q)
    );
  };

  const removeQuestion = (questionId: string) => {
    setAvailableQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const getQuestionById = (questionId: string) => {
    return availableQuestions.find(q => q.id === questionId);
  };

  const getDependencyOptions = (currentQuestionId: string) => {
    return availableQuestions
      .filter(question => question.id !== currentQuestionId)
      .map(question => ({
        value: question.id,
        label: question.title,
        type: question.type,
        choices: question.choices,
      }));
  };

  const value: SurveyContextType = {
    availableQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    getQuestionById,
    getDependencyOptions,
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};
