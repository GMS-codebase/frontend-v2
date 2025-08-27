export interface IResponse {
  uuid: string;
  deletedStatus: boolean;
  doneAt: string;
  lastUpdatedAt: string;
  doneBy: string;
  lastUpdatedBy: string | null;
  message: string;
  numberOfTraineesRequired: number | null;
  status: "ACCEPTED" | "REJECTED" | string;
  user?: {
    firstname: string;
    lastname: string;
  };
}

export interface IRequest {
  uuid: string;
  deletedStatus: boolean;
  doneAt: string;
  lastUpdatedAt: string;
  doneBy: any;
  lastUpdatedBy: any;
  requestType: "ADD_TRAINEES" | "REMOVE_TRAINEES" | "EDIT_TRAINEES";
  reason: string;
  newTraineesRequested?: number;
  answered: boolean;
  status: any;
}

export interface ITraining {
  uuid: string;
  deletedStatus: boolean;
  doneAt: string;
  lastUpdatedAt: string;
  doneBy: string | null;
  lastUpdatedBy: string | null;
  title: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | string;
  trainingManual: string;
  competencies: string[];
  application: any;
  applicant: any;
  traineesToAdd?: number;
  trainees: ITrainingTrainee[];
  trainingRequestResponses: IResponse[];
}

export interface ITrainingTrainee {
  uuid: string;
  deletedStatus: boolean;
  doneAt: string;
  lastUpdatedAt: string;
  doneBy: string | null;
  lastUpdatedBy: string | null;
  nationalId: string;
  lastName: string;
  firstName: string;
  gender: "MALE" | "FEMALE" | string;
  dob?:string;
  district: string;
  disability: string;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | string;
  traineePhoneNumber: string;
  parentPhoneNumber: string;
  educationLevel: string;
  institutionName: string;
  trainingProgram: string;
  projectName: string;
  graduateStatus: "ONGOING" | "GRADUATED" | string;
  certificationRequested: boolean;
  certificationStatus: "PENDING" | "APPROVED" | "REJECTED" | string;
  editRequested: boolean;
  removalRequested: boolean;
  canBeEdited: boolean;
  canBeRemoved: boolean;
}
