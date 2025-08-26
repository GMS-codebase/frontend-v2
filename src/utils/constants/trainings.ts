import { Training } from "@/types";

//test data
export const trainingsData: Training[] = [
  {
    uuid: "trn-001",
    title: "My Training 1",
    startDate: "2025-08-11",
    competencies: ["Communication", "Teamwork"],
    endDate: "2025-08-15",
    status: "rejected",
    applicationId: "app-001",
    trainingManual: "",
    traineesFile: "",
  },
  {
    uuid: "trn-002",
    title: "My Training 2",
    startDate: "2025-09-01",
    competencies: ["Leadership", "Problem Solving"],
    applicationId: "app-002",
    endDate: "2025-09-05",
    status: "draft",
    trainingManual: "",
    traineesFile: "",
  },
  {
    uuid: "trn-003",
    title: "My Training 2",
    startDate: "2025-07-20",
    endDate: "2025-07-22",
    competencies: ["Time Management", "Adaptability"],
    applicationId: "app-003",
    status: "accepted",
    trainingManual: "",
    traineesFile: "",
  },
];

export const traineesData = [
  {
    id: 1,
    firstName: "Drew",
    lastName: "Jakubowski",
    nid: "978-1-336-65780-9",
    phoneNumber: "260-706-8504 x472",
    email: "Drew4@gmail.com",
    dob: "9/05/61"
  },
  {
    id: 2,
    firstName: "Peggy",
    lastName: "Rodriguez",
    nid: "978-1-6790-9441-5",
    phoneNumber: "(287) 770-0364 x04110",
    email: "Peggy_Rodriguez@hotmail.com",
    dob: "27/07/44"
  },
  {
    id: 3,
    firstName: "Sylvester",
    lastName: "Leuschke",
    nid: "978-1-77790-568-8",
    phoneNumber: "355-705-5650",
    email: "Sylvester.Leuschke59@yahoo.com",
    dob: "05.12.71"
  },
  {
    id: 4,
    firstName: "Marianne",
    lastName: "O'Conner",
    nid: "978-1-8456-1234-1",
    phoneNumber: "(123) 456-7890 x123",
    email: "marianne.oconner@example.com",
    dob: "15/03/85"
  },
  {
    id: 5,
    firstName: "Terrence",
    lastName: "Smith",
    nid: "978-1-9876-5432-1",
    phoneNumber: "555-123-4567",
    email: "terrence.smith@business.org",
    dob: "22/11/78"
  },
  {
    id: 6,
    firstName: "Lucille",
    lastName: "Barton",
    nid: "978-1-2345-6789-0",
    phoneNumber: "+1 (800) 555-0199",
    email: "lucille.barton@testmail.net",
    dob: "30/09/92"
  },
  {
    id: 7,
    firstName: "Raquel",
    lastName: "Gutkowski",
    nid: "978-1-1122-3344-5",
    phoneNumber: "611-222-3333 x444",
    email: "raquel.gutkowski@demo.io",
    dob: "14/02/67"
  }
];
