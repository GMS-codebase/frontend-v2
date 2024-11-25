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
  type: "text" | "paragraph" | "file" | "table";
  required: boolean;
  commentable: boolean;
  columns?:TableColumn[]
}


export interface TableColumn {
  title: string;
  type: "text" | "number" | "select";
  options?: string[];
}