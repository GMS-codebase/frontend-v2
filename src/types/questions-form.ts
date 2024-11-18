export interface QuestionForm {
  [key: string]: {
    name: string;
    description: string;
    pages: {
      questions: Question[];
    }[];
  };
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: "text" | "paragraph" | "file" | "table";
  required: boolean;
  commentable: boolean;
}
