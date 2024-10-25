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
import { handleSubmit } from "@/utils/funcs";

const Page = () => {
  const router = useRouter();
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");

  const { id, applicationId } = useParams();
  const [loading, setLoading] = useState<any>();
  const [currentStep, setCurrentStep] = useState(0);
  const { applications,loading:applicationsLoading } = useSelector((state: any) => state.applications);
  const application = applications.find((ap: any) => ap.uuid == applicationId);
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
    budgetLines: [],
    staffAttachment: "",
  });

  useEffect(() => {
    if (application) {
      setData((prevData) => ({
        ...prevData,
        title: application.projectFunding?.title || prevData.title,
        activitiesAndOutcomes:
          application.projectFunding?.activitiesAndOutcomes ||
          prevData.activitiesAndOutcomes,
        readinessExecute:
          application.projectFunding?.readinessExecute ||
          prevData.readinessExecute,
        role: application.projectFunding?.role || prevData.role,
        institution:
          application.projectFunding?.institution || prevData.institution,
        sustainability:
          application.projectFunding?.sustainability || prevData.sustainability,
        recruitmentTrainerNumber:
          application.projectFunding?.recruitmentTrainerNumber ||
          prevData.recruitmentTrainerNumber,
        identificationMember:
          application.projectFunding?.identificationMember ||
          prevData.identificationMember,
        identificationEmployee:
          application.projectFunding?.identificationEmployee ||
          prevData.identificationEmployee,
        assessorsAndFacilitators:
          application.projectFunding?.assessorsAndFacilitators ||
          prevData.assessorsAndFacilitators,
        staffAttachment:
          application.projectFunding?.staffAttachment ||
          prevData.staffAttachment,
        trainingProcess:
          application.projectFunding?.trainingProcess ||
          prevData.trainingProcess,
        trainingEquipment:
          application.projectFunding?.trainingEquipment ||
          prevData.trainingEquipment,
        assessmentAndCertificationProcess:
          application.projectFunding?.assessmentAndCertificationProcess ||
          prevData.assessmentAndCertificationProcess,
        assessmentEquipment:
          application.projectFunding?.assessmentEquipment ||
          prevData.assessmentEquipment,
        budgetSummaryAttachment:
          application.budget?.budgetSummaryAttachment ||
          prevData.budgetSummaryAttachment,
        contributionFromApplicant:
          application.budget?.contributionFromApplicant ||
          prevData.contributionFromApplicant,
        budgetLines: application.budget?.budgetLines || prevData.budgetLines,
      }));
    }
  }, [application]);

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

  if(applicationsLoading || !application){
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  console.log(application)

  return (
    <div>
      <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-2xl ">
        <div className=" flex justify-between items-center">
          <p className="font-semibold text-2xl">Questions and answers</p>
          <button
            className="bg-primary text-white py-3 px-10 flex items-center gap-2 rounded-full "
            onClick={() => {
              handleSubmit("save", setLoading, data, application);
            }}
            disabled={loading === "save"}
          >
            {loading === "save" ? (
              <p>Loading...</p>
            ) : (
              <>
                <IoIosSave />
                <p className="">Save Draft</p>
              </>
            )}
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
              handleSubmit("submit", setLoading, data, application, () =>
                router.push("/applicant/applications"),
              );
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
