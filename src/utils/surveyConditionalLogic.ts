import { Survey, ConditionalLogic } from "@/types/surveys-form";

/**
 * Check if a question should be shown based on conditional logic
 * @param question - The question to check
 * @param answers - Current answers from the user
 * @param allQuestions - All questions in the survey to find dependencies
 * @returns boolean indicating if the question should be shown
 */
export const shouldShowQuestion = (
  question: Survey,
  answers: { [key: string]: any },
  allQuestions: Survey[]
): boolean => {
  // If no conditional logic, always show the question
  if (!question.conditionalLogic?.enabled) {
    return true;
  }

  const { dependsOn, showWhen } = question.conditionalLogic;
  
  // If no dependency is set, show the question
  if (!dependsOn) {
    return true;
  }

  // Get the dependent question's answer
  const dependentAnswer = answers[dependsOn];
  
  // If no answer for the dependent question, don't show this question
  if (dependentAnswer === undefined || dependentAnswer === null || dependentAnswer === "") {
    return false;
  }

  const { operator, value } = showWhen;

  // Apply the conditional logic based on the operator
  switch (operator) {
    case "equals":
      return String(dependentAnswer) === String(value);
    
    case "not_equals":
      return String(dependentAnswer) !== String(value);
    
    case "contains":
      return String(dependentAnswer).includes(String(value));
    
    case "not_contains":
      return !String(dependentAnswer).includes(String(value));
    
    case "greater_than":
      const numAnswer = Number(dependentAnswer);
      const numValue = Number(value);
      return !isNaN(numAnswer) && !isNaN(numValue) && numAnswer > numValue;
    
    case "less_than":
      const numAnswer2 = Number(dependentAnswer);
      const numValue2 = Number(value);
      return !isNaN(numAnswer2) && !isNaN(numValue2) && numAnswer2 < numValue2;
    
    default:
      return true;
  }
};

/**
 * Get all questions that depend on a specific question
 * @param questionId - The ID of the question to check dependencies for
 * @param allQuestions - All questions in the survey
 * @returns Array of questions that depend on the specified question
 */
export const getDependentQuestions = (
  questionId: string,
  allQuestions: Survey[]
): Survey[] => {
  return allQuestions.filter(question => 
    question.conditionalLogic?.enabled && 
    question.conditionalLogic?.dependsOn === questionId
  );
};

/**
 * Get all available question IDs for conditional logic dependencies
 * @param currentQuestionId - The ID of the current question (to exclude from options)
 * @param allQuestions - All questions in the survey
 * @returns Array of question IDs that can be used as dependencies
 */
export const getAvailableDependencyOptions = (
  currentQuestionId: string,
  allQuestions: Survey[]
): { value: string; label: string }[] => {
  return allQuestions
    .filter(question => question.id !== currentQuestionId)
    .map(question => ({
      value: question.id,
      label: question.title || `Question ${question.id}`,
    }));
};



