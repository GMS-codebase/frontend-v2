import { ApplicationQuestions } from "@/types/application";
import { Select } from "@mantine/core";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import {
  TrainingProgress,
  TrainingEquipments,
  Staff,
  LastPageQuestions,
  FirstPageQuestions,
} from "./FundingPages";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { Comments } from "@/types";

interface FundingQuestionsProps {
  data: ApplicationQuestions;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  comments?: Comments;
  setComments?: React.Dispatch<React.SetStateAction<Comments>>;
  goToBudget?: () => void;
}

const FundingQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  comments,
  setComments,
  goToBudget,
}) => {
  const { applicationId , id} = useParams();
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [applicationTrades, setApplicationTrades] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await authorizedApi.get(
          `/application/get-application/${applicationId ?? id}`,
        );
        const applicationData = response.data.data.data;
        const trades: any = applicationData.trades.map((trade: any) => ({
          label: trade.title,
          value: trade.uuid,
        }));
        setApplicationTrades(trades);
      } catch (error) {
        console.error("Error fetching application data:", error);
      }
    };

    fetchApplicationData();
  }, [applicationId]);

  // Automatically call goToBudget when the last step is reached
  useEffect(() => {
    if (currentStep === steps.length - 1 && goToBudget) {
      goToBudget(); // Automatically switch to IndicativeBudget
    }
  }, [currentStep, goToBudget]);

  const handleInputChange = (inputName: string, value: any) => {
    setData &&
      setData((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file && setData) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setData((prev: any) => ({ ...prev, [key]: file }));
    }
  };

  const handleArrayOfObjectsChange = (
    inputName: string,
    value: any,
    index: number,
  ) => {
    setData &&
      setData((prev: any) => {
        const newData = [...(prev[inputName] || [])];
        newData[index] = value;
        return {
          ...prev,
          [inputName]: newData,
        };
      });
  };

  const steps = [
    <FirstPageQuestions
      key="first"
      data={data}
      handleInputChange={handleInputChange}
      commentData={comments}
      setCommentData={setComments}
    />,
    <TrainingProgress
      key="progress"
      data={data}
      files={files}
      handleArrayOfObjectsChange={handleArrayOfObjectsChange}
      handleFileChange={handleFileChange}
      trades={applicationTrades}
      commentsData={comments}
      setCommentsData={setComments}
    />,
    <TrainingEquipments
      key="equipments"
      data={data}
      files={files}
      handleArrayOfObjectsChange={handleArrayOfObjectsChange}
      handleFileChange={handleFileChange}
      trades={applicationTrades}
      commentsData={comments}
      setCommentsData={setComments}
    />,
    <Staff
      key="staff"
      data={data}
      handleArrayOfObjectsChange={handleArrayOfObjectsChange}
      commentData={comments}
      setCommentData={setComments}
    />,
    <LastPageQuestions
      key="last"
      data={data}
      handleInputChange={handleInputChange}
      files={files}
      handleFileChange={handleFileChange}
      commentData={comments}
      setCommentData={setComments}
    />,
  ];

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      {steps[currentStep]}
      <div className="flex items-center gap-5 justify-end">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`px-10 py-2 rounded-full text-white ${
            currentStep === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <button
          onClick={currentStep === steps.length - 1 ? goToBudget : handleNext}
          className={`px-10 py-2 rounded-full text-white ${
            currentStep === steps.length - 1
              ? "bg-primary hover:bg-blue-600"
              : "bg-primary hover:bg-blue-600"
          }`}
        >
          {currentStep === steps.length - 1 ? "Go to Budget" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default FundingQuestions;
