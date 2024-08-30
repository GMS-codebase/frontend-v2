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
  subwindows?: string[];
  comments?: Comments;
  setComments?: React.Dispatch<React.SetStateAction<Comments>>;
}

const FundingQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  subwindows,
  comments,
  setComments,
}) => {
  const { applicationId } = useParams();
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [applicationTrades, setApplicationTrades] = useState<any[]>([]);
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await authorizedApi.get(
          `/application/get-application/${applicationId}`,
        );
        const applicationData = response.data.data.data;
        console.log(response.data);
        const trades: any = applicationData.trades.map((trade: any) => ({
          label: trade.title,
          value: trade.uuid,
        }));
        console.log(trades);
        setApplicationTrades(trades);
      } catch (error) {
        console.error("Error fetching application data:", error);
      }
    };

    fetchApplicationData();
  }, [applicationId]);

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
    index: number
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

  return (
    <div className="space-y-2">
      <FirstPageQuestions
        data={data}
        handleInputChange={handleInputChange}
        commentData={comments}
        setCommentData={setComments}
      />
      <TrainingProgress
        data={data}
        files={files}
        handleArrayOfObjectsChange={handleArrayOfObjectsChange}
        handleFileChange={handleFileChange}
        trades={applicationTrades}
        commentsData={comments}
        setCommentsData={setComments}
      />
      <TrainingEquipments
        data={data}
        files={files}
        handleArrayOfObjectsChange={handleArrayOfObjectsChange}
        handleFileChange={handleFileChange}
        trades={applicationTrades}
        commentsData={comments}
        setCommentsData={setComments}
      />
      <Staff
        data={data}
        handleArrayOfObjectsChange={handleArrayOfObjectsChange}
        commentData={comments}
        setCommentData={setComments}
      />
      <LastPageQuestions
        data={data}
        handleInputChange={handleInputChange}
        files={files}
        handleFileChange={handleFileChange}
        commentData={comments}
        setCommentData={setComments}
      />
    </div>
  );
};

export default FundingQuestions;
