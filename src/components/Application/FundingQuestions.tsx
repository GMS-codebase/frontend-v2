import { ApplicationQuestions } from "@/types/application";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Comments } from "@/types";
import { Page1 } from "./Pages/Page1";
import { Page2 } from "./Pages/Page2";
import { Page3 } from "./Pages/Page3";
import { Page4 } from "./Pages/Page4";
import { Page5 } from "./Pages/Page5";

interface FundingQuestionsProps {
  data: ApplicationQuestions;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  comments?: Comments;
  setComments?: React.Dispatch<React.SetStateAction<Comments>>;
  goToBudget?: () => void;
  showComments?: boolean;
  application?: any;
}

const FundingQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  comments,
  setComments,
  goToBudget,
  application,
  showComments,
}) => {
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const trades: any = application?.trades.map((trade: any, i: any) => ({
    label: trade.trade.title,
    value: trade.trade.title,
  }));

  const handleChange = (input: string, value: any) => {
    errors[input] && setErrors((prev: any) => ({ ...prev, [input]: null }));
    setData && setData((prev: any) => ({ ...prev, [input]: value }));
  };

  const steps = [
    <Page1
      key="first"
      data={data}
      {...(setData && { setData: handleChange })}
      comments={comments}
      setComments={setComments}
    />,
    <Page2
      key="progress"
      type={
        application?.window?.title?.includes("3") &&
        application?.subWindow?.title?.includes("2")
          ? "assessment"
          : "training"
      }
      data={data}
      {...(setData && { setData: handleChange })}
      trades={trades}
      commentsData={comments}
      setCommentsData={setComments}
      application={application}
    />,
    <Page3
      key="equipments"
      data={data}
      {...(setData && { setData: handleChange })}
      trades={trades}
      commentsData={comments}
      setCommentsData={setComments}
    />,
    <Page4
      key="staff"
      data={data}
      files={files}
      {...(setData && { setData: handleChange })}
      comments={comments}
      setComments={setComments}
    />,
    <Page5
      key="last"
      data={data}
      {...(setData && { setData: handleChange })}
      comments={comments}
      setComments={setComments}
    />,
  ];

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === steps.length - 1 && goToBudget) {
      goToBudget();
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
