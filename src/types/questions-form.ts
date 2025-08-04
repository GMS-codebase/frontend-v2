export interface QuestionForm {
  [key: string]: {
    name: string;
    description: string;
    pages: {
      questions: Question[];
    }[];
  };
}

export interface Form {
  uuid?: string;
  name: string;
  qns: any;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type:
    | "text"
    | "paragraph"
    | "file"
    | "table"
    | "radio"
    | "checkbox"
    | "select"
    | "multiselect";
  required: boolean;
  commentable: boolean;
  columns?: TableColumn[];
  choices?: string[];
  template?: string;
}

export interface TableColumn {
  title: string;
  type: "text" | "number" | "select" | "date";
  options?: string[];
}
