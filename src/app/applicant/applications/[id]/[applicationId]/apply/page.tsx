"use client";
import React, { useState } from "react";
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
const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");
  const { id, applicationId } = useParams();
  const [loading, setLoading] = useState(false);
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
  });
  const handleSubmit = async () => {
    setLoading(true);
    console.log(data)
    // const requiredFields = [
    //   { name: "Title", value: data.title, message: "Please enter the title." },
    //   {
    //     name: "Activities and Outcomes",
    //     value: data.activitiesAndOutcomes,
    //     message: "Please describe the activities and outcomes.",
    //   },
    //   {
    //     name: "Readiness to Execute",
    //     value: data.readinessExecute,
    //     message: "Please provide your readiness to execute.",
    //   },
    //   { name: "Role", value: data.role, message: "Please specify the role." },
    //   {
    //     name: "Institution",
    //     value: data.institution,
    //     message: "Please enter the institution name.",
    //   },
    //   {
    //     name: "Training Process",
    //     value: data.trainingProcess,
    //     message: "Please outline the training process.",
    //   },
    //   {
    //     name: "Training Equipment",
    //     value: data.trainingEquipment,
    //     message: "Please list the training equipment.",
    //   },
    //   {
    //     name: "Employee Identification",
    //     value: data.identificationEmployee,
    //     message: "Please provide the employee identification.",
    //   },
    //   {
    //     name: "Staffs",
    //     value: data.staffs,
    //     message: "Please list the staffs involved.",
    //   },
    //   {
    //     name: "Sustainability",
    //     value: data.sustainability,
    //     message: "Please describe sustainability efforts.",
    //   },
    //   {
    //     name: "Contribution from Applicant",
    //     value: data.contributionFromApplicant,
    //     message: "Please detail the contribution from the applicant.",
    //   },
    //   {
    //     name: "Recruitment Trainer Number",
    //     value: data.recruitmentTrainerNumber,
    //     message: "Please provide the recruitment trainer number.",
    //   },
    //   {
    //     name: "Member Identification",
    //     value: data.identificationMember,
    //     message: "Please provide member identification.",
    //   },
    //   {
    //     name: "Assessment and Certification Process",
    //     value: data.assessmentAndCertificationProcess,
    //     message: "Please outline the assessment and certification process.",
    //   },
    //   {
    //     name: "Assessment Equipment",
    //     value: data.assessmentEquipment,
    //     message: "Please list the assessment equipment.",
    //   },
    //   {
    //     name: "Recruitment Candidates Number",
    //     value: data.recruitmentCandidatesNumber,
    //     message: "Please provide the number of recruitment candidates.",
    //   },
    //   {
    //     name: "Assessors and Facilitators",
    //     value: data.assessorsAndFacilitators,
    //     message: "Please list the assessors and facilitators.",
    //   },
    //   {
    //     name: "Contribution",
    //     value: data.contribution,
    //     message: "Please detail the contribution.",
    //   },
    // ];

    // for (let field of requiredFields) {
    //   if (
    //     !field.value ||
    //     (Array.isArray(field.value) && field.value.length === 0)
    //   ) {
    //     notifications.show({
    //       message: field.message,
    //       color: "red",
    //     });
    //     return;
    //   }
    // }
    const submitData = new FormData();

    if (data.title) {
      submitData.append("title", data.title);
    }
    if (data.activitiesAndOutcomes) {
      submitData.append("activitiesAndOutcomes", data.activitiesAndOutcomes);
    }
    if (data.readinessExecute) {
      submitData.append("readinessExecute", data.readinessExecute);
    }
    if (data.role) {
      submitData.append("role", data.role);
    }
    if (data.institution) {
      submitData.append("institution", data.institution);
    }
    if (data.trainingProcess && data.trainingProcess.length > 0) {
      submitData.append(
        "trainingProcess",
        JSON.stringify(data.trainingProcess),
      );
    }
    if (data.trainingEquipment && data.trainingEquipment.length > 0) {
      submitData.append(
        "trainingEquipment",
        JSON.stringify(data.trainingEquipment),
      );
    }
    if (data.identificationEmployee) {
      submitData.append("identificationEmployee", data.identificationEmployee);
    }
    if (data.staffs && data.staffs.length > 0) {
      submitData.append("staffs", JSON.stringify(data.staffs));
    }
    if (data.sustainability) {
      submitData.append("sustainability", data.sustainability);
    }
    if (data.contributionFromApplicant) {
      submitData.append(
        "contributionFromApplicant",
        data.contributionFromApplicant,
      );
    }
    if (data.recruitmentTrainerNumber) {
      submitData.append(
        "recruitmentTrainerNumber",
        data.recruitmentTrainerNumber,
      );
    }
    if (data.identificationMember) {
      submitData.append("identificationMember", data.identificationMember);
    }
    if (
      data.assessmentAndCertificationProcess &&
      data.assessmentAndCertificationProcess.length > 0
    ) {
      submitData.append(
        "assessmentAndCertificationProcess",
        JSON.stringify(data.assessmentAndCertificationProcess),
      );
    }
    if (data.assessmentEquipment && data.assessmentEquipment.length > 0) {
      submitData.append(
        "assessmentEquipment",
        JSON.stringify(data.assessmentEquipment),
      );
    }
    if (data.recruitmentCandidatesNumber) {
      submitData.append(
        "recruitmentCandidatesNumber",
        data.recruitmentCandidatesNumber,
      );
    }
    if (data.assessorsAndFacilitators) {
      submitData.append(
        "assessorsAndFacilitators",
        data.assessorsAndFacilitators,
      );
    }
    if (data.contribution) {
      submitData.append("contribution", data.contribution);
    }

    if (data.roleAttachment) {
      submitData.append("roleAttachment", data.roleAttachment);
    }
    if (data.institutionAttachment) {
      submitData.append("institutionAttachment", data.institutionAttachment);
    }
    if (data.trainingManualAttachment) {
      submitData.append(
        "trainingManualAttachment",
        data.trainingManualAttachment,
      );
    }
    if (data.trainingEquipmentAttachment) {
      submitData.append(
        "trainingEquipmentAttachment",
        data.trainingEquipmentAttachment,
      );
    }
    if (data.previousFinancialReportAttachment) {
      submitData.append(
        "previousFinancialReportAttachment",
        data.previousFinancialReportAttachment,
      );
    }
    if (data.MOUsAttachment && data.MOUsAttachment.length > 0) {
      data.MOUsAttachment.forEach((file, index) => {
        submitData.append(`MOUsAttachment[${index}]`, file);
      });
    }
    if (data.assessmentEquipmentAttachment) {
      submitData.append(
        "assessmentEquipmentAttachment",
        data.assessmentEquipmentAttachment,
      );
    }
    if (data.budgetSummaryAttachment) {
      submitData.append(
        "budgetSummaryAttachment",
        data.budgetSummaryAttachment,
      );
    }

    try {
      const res = await authorizedApi.post(
        `/application/fillApplication/${applicationId}`,
        submitData
      );
      console.log(res.data);
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
    } catch (err: any) {
      console.log(err.response);
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    }
    setLoading(false);
  };

  const calls = useSelector((state: any) => state.calls);
  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return <FundingQuestions data={data} setData={setData} />;
      case "IndicativeBudget":
        return <BudgetQuestions data={data} setData={setData} />;
      default:
        return null;
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-2xl ">
        <div className="font-semibold text-2xl">Questions and answers</div>
        <div className="flex font-semibold">
          <div
            onClick={() => setCurrentComponent("Project")}
            className={`cursor-pointer w-1/2 ${
              currentComponent === "Project" ? "bg-[#005DE9] bg-opacity-10" : ""
            } h-16 flex items-center justify-center`}
          >
            Project Funding Application
          </div>
          <div
            onClick={() => setCurrentComponent("IndicativeBudget")}
            className={`cursor-pointer w-1/2 ${
              currentComponent === "IndicativeBudget"
                ? "bg-[#C50000] bg-opacity-10"
                : ""
            } h-16 flex items-center justify-center`}
          >
            Indicative Budget
          </div>
        </div>
        <div className="w-full">{renderComponent()}</div>
        <div className="w-full flex justify-center mt-4 space-x-4">
          <button
            type="button"
            className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Loading..." : "Send Application"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Page;
