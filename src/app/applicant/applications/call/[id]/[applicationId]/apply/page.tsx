"use client";
import React, { useEffect, useState } from "react";
import Project7 from "@/components/ApplicantDetails/Project7";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import Questions from "@/components/Application/Questions";
import {
  indicativeBudgetQuestions,
  questions,
} from "@/utils/constants/questions";
import FundingQuestions from "@/components/Application/FundingQuestions";
import { ApplicationQuestions } from "@/types/application";
import BudgetQuestions from "@/components/Application/BudgetQuestions";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { IoIosSave } from "react-icons/io";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");

  const { id, applicationId } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const {applications} = useSelector((state:any)=>state.applications)
  const application = applications.find((ap:any)=>ap.uuid == applicationId)

  console.log("application ", application);
  const [data, setData] = useState<ApplicationQuestions>({
    title: "",
    activitiesAndOutcomes: "",
    readinessExecute: "",
    role: "",
    institution: "",
    trainingProcess: [],
    trainingEquipment: [],
    identificationEmployee: "",
    staffs: [],
    sustainability: "",
    contributionFromApplicant: "",
    recruitmentTrainerNumber: "",
    identificationMember: "",
    assessmentAndCertificationProcess: [],
    assessmentEquipment: [],
    recruitmentCandidatesNumber: "",
    assessorsAndFacilitators: "",
    contribution: "",
    roleAttachment: undefined,
    institutionAttachment: undefined,
    trainingManualAttachment: undefined,
    trainingEquipmentAttachment: undefined,
    previousFinancialReportAttachment: undefined,
    MOUsAttachment: [],
    assessmentEquipmentAttachment: undefined,
    budgetSummaryAttachment: undefined,
    staffAttachment: "",
  });

  const handleSubmit = async (type: "submit" | "save") => {
    setLoading(true);
    const submitData = new FormData();

    if (data.title) submitData.append("title", data.title);
    if (data.activitiesAndOutcomes)
      submitData.append("activitiesAndOutcomes", data.activitiesAndOutcomes);
    if (data.readinessExecute)
      submitData.append("readinessExecute", data.readinessExecute);
    if (data.role) submitData.append("role", data.role);
    if (data.institution) submitData.append("institution", data.institution);
    if (data.trainingProcess && data.trainingProcess.length > 0)
      submitData.append(
        "trainingProcess",
        JSON.stringify(data.trainingProcess),
      );
    if (data.trainingEquipment && data.trainingEquipment.length > 0)
      submitData.append(
        "trainingEquipment",
        JSON.stringify(data.trainingEquipment),
      );
    if (data.identificationEmployee)
      submitData.append("identificationEmployee", data.identificationEmployee);
    if (data.staffs && data.staffs.length > 0)
      submitData.append("staffs", JSON.stringify(data.staffs));
    if (data.sustainability)
      submitData.append("sustainability", data.sustainability);
    if (data.contributionFromApplicant)
      submitData.append(
        "contributionFromApplicant",
        data.contributionFromApplicant,
      );
    if (data.recruitmentTrainerNumber)
      submitData.append(
        "recruitmentTrainerNumber",
        data.recruitmentTrainerNumber,
      );
    if (data.identificationMember)
      submitData.append("identificationMember", data.identificationMember);
    if (
      data.assessmentAndCertificationProcess &&
      data.assessmentAndCertificationProcess.length > 0
    )
      submitData.append(
        "assessmentAndCertificationProcess",
        JSON.stringify(data.assessmentAndCertificationProcess),
      );
    if (data.assessmentEquipment && data.assessmentEquipment.length > 0)
      submitData.append(
        "assessmentEquipment",
        JSON.stringify(data.assessmentEquipment),
      );
    if (data.recruitmentCandidatesNumber)
      submitData.append(
        "recruitmentCandidatesNumber",
        data.recruitmentCandidatesNumber,
      );
    if (data.assessorsAndFacilitators)
      submitData.append(
        "assessorsAndFacilitators",
        data.assessorsAndFacilitators,
      );
    if (data.contribution) submitData.append("contribution", data.contribution);
    if (data.roleAttachment)
      submitData.append("roleAttachment", data.roleAttachment);
    if (data.institutionAttachment)
      submitData.append("institutionAttachment", data.institutionAttachment);
    if (data.trainingManualAttachment)
      submitData.append(
        "trainingManualAttachment",
        data.trainingManualAttachment,
      );
    if (data.staffAttachment)
      submitData.append("staffAttachment", data.staffAttachment);
    if (data.budgetLines)
      submitData.append("budgetLines", JSON.stringify(data.budgetLines));
    if (data.trainingEquipmentAttachment)
      submitData.append(
        "trainingEquipmentAttachment",
        data.trainingEquipmentAttachment,
      );
    if (data.previousFinancialReportAttachment)
      submitData.append(
        "previousFinancialReportAttachment",
        data.previousFinancialReportAttachment,
      );
    if (data.MOUsAttachment && data.MOUsAttachment.length > 0) {
      data.MOUsAttachment.forEach((file, index) => {
        submitData.append(`MOUsAttachment[${index}]`, file);
      });
    }
    if (data.assessmentEquipmentAttachment)
      submitData.append(
        "assessmentEquipmentAttachment",
        data.assessmentEquipmentAttachment,
      );
    if (data.budgetSummaryAttachment)
      submitData.append(
        "budgetSummaryAttachment",
        data.budgetSummaryAttachment,
      );

    console.log("final data -->", data);
    try {
      const res = await authorizedApi.post(
        `/application/${type === "save" ? "saveApplicationStatus" : "fillApplication"}/${applicationId}`,
        submitData,
      );
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
      setLoading(false);
      router.push("/applicant/applications");
    } catch (err: any) {
      console.log(err);
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData({
      title: "",
      activitiesAndOutcomes: "",
      readinessExecute: "",
      role: "",
      institution: "",
      trainingProcess: [],
      trainingEquipment: [],
      identificationEmployee: "",
      staffs: [],
      sustainability: "",
      contributionFromApplicant: "",
      recruitmentTrainerNumber: "",
      identificationMember: "",
      assessmentAndCertificationProcess: [],
      assessmentEquipment: [],
      staffAttachment: "",
      recruitmentCandidatesNumber: "",
      assessorsAndFacilitators: "",
      contribution: "",
      roleAttachment: undefined,
      institutionAttachment: undefined,
      trainingManualAttachment: undefined,
      trainingEquipmentAttachment: undefined,
      previousFinancialReportAttachment: undefined,
      MOUsAttachment: [],
      assessmentEquipmentAttachment: undefined,
      budgetSummaryAttachment: undefined,
    });
  };

  console.log("application data", application)
  const calls = useSelector((state: any) => state.calls);
  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return (
          <FundingQuestions
            application={application}
            data={data}
            setData={setData}
            goToBudget={() => setCurrentComponent("IndicativeBudget")}
          />
        );
      case "IndicativeBudget":
        return (
          <BudgetQuestions
            application={application}
            data={data}
            setData={setData}
          />
        );
      default:
        return null;
    }
  };

  const allFieldsFilled = Object.values(data).every((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== undefined;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-2xl ">
        <div className="font-semibold text-2xl flex justify-between items-center">
          <p>Questions and answers</p>
          <button
            className="bg-primary text-white p-3 rounded-full"
            onClick={() => {
              handleSubmit("save");
            }}
            disabled={!allFieldsFilled || loading}
          >
            <IoIosSave />
          </button>
        </div>
        <div className="flex font-semibold">
          <div
            onClick={() => setCurrentComponent("Project")}
            className={`cursor-pointer w-1/2 transition-all duration-200 ${
              currentComponent === "Project"
                ? "bg-[#005DE9] bg-opacity-10 text-primary border-b border-b-primary"
                : ""
            } py-2.5 flex items-center justify-center`}
          >
            Project Funding Application
          </div>
          <div
            onClick={() => setCurrentComponent("IndicativeBudget")}
            className={`cursor-pointer w-1/2 transition-all duration-200  ${
              currentComponent === "IndicativeBudget"
                ? "bg-[#005DE9] bg-opacity-10 text-primary border-b border-b-primary"
                : ""
            } py-2.5 flex items-center justify-center`}
          >
            Indicative Budget
          </div>
        </div>
        <div className="w-full">{renderComponent()}</div>
        <div className="w-full flex justify-center mt-4 space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              handleSubmit("submit");
            }}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary text-white
              `}
          >
            {loading ? "Loading..." : "Send Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
