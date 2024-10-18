import { Comments } from "@/types";
import { ApplicationQuestions } from "@/types/application";
import { handleDownloadFile } from "@/utils/funcs";
import { Select } from "@mantine/core";
import React, { useState, ChangeEvent } from "react";

interface FundingQuestionsProps {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<ApplicationQuestions>>;
  commentData?: Comments;
  setCommentData?: React.Dispatch<React.SetStateAction<Comments>>;
  showComments?: boolean;
  trades: any[];
}

const BudgetQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  commentData,
  setCommentData,
  showComments,
  trades,
}) => {
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});

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
  const handleInputChange = (inputName: string, value: any) => {
    if (setData) {
      setData((prev: ApplicationQuestions) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setData &&
        setData((prev: ApplicationQuestions) => ({
          ...prev,
          [key]: file,
        }));
    }
  };

  const handleCommentChange = (inputName: string, value: any) => {
    if (setCommentData) {
      setCommentData((prev: Comments) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  const [trainingProcessInputs, setTrainingProcessInputs] = useState({
    trade: "",
    amount: "",
    budgetLine: "",
  });

  const validateTrainingProcessInputs = () => {
    const { trade, amount, budgetLine } = trainingProcessInputs;
    return trade && amount && budgetLine;
  };

  const addTrainingProcess = () => {
    if (!validateTrainingProcessInputs()) {
      alert("Please fill in all fields before adding.");
      return;
    }
    handleArrayOfObjectsChange(
      "budgetLines",
      trainingProcessInputs,
      data?.budgetLines?.length || 0,
    );
    console.log("data in budget --> ", data);
    setTrainingProcessInputs({
      trade: "",
      amount: "",
      budgetLine: "",
    });
  };

  const renderTrainingProcessInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Select
          name="budgetLine"
          value={trainingProcessInputs.budgetLine}
          onChange={(selectedOption: any) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              budgetLine: selectedOption || "",
            }))
          }
          data={[
            "Occupation, safety, health and environmental at Workplace (OSHE)",
            "Refreshment",
            "Consumables",
            "Trainees Facilitation Fees",
            "Trainers Allowances",
            "Graduation Fees ",
            "Stationeries",
            "Certificates",
            "Insurance Cost for trainees",
            "Other Related Training Cost (Communication fees, Mission Allowances, Public Awareness, Cleaning & Security)",
            "Other (Specify)",
          ]}
          className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Select Budget Line"
        />
        <input
          type="text"
          placeholder="Amount"
          value={trainingProcessInputs.amount}
          onChange={(e) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <Select
          name="trade"
          value={trainingProcessInputs.trade}
          onChange={(selectedOption: any) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              trade: selectedOption || "",
            }))
          }
          data={trades}
          className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Select Trade"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={addTrainingProcess}
          className="mt-2 p-2 bg-primary text-white px-20 rounded-2xl"
        >
          Add
        </button>
      </div>
    </div>
  );
  return (
    <div className="space-y-2">
      <div className="">
        <h3 className="text-lg font-bold">Budget Summary</h3>
        <p className="text-sm text-gray-600">
          Attach a file related to the budget summary
        </p>
        {commentData ? (
          <div className="mt-2">
            <button
              disabled={data?.budgetSummaryAttachment === null}
              onClick={() =>
                handleDownloadFile(
                  data?.budgetSummaryAttachment,
                  "applications",
                )
              }
              className={`w-full h-12 ${data?.budgetSummaryAttachment ? "bg-primary" : "bg-gray-600"} text-white rounded-full`}
            >
              {data?.budgetSummaryAttachment
                ? "Download Budget Summary"
                : "No Budget Summary Attached"}
            </button>
            {showComments && (
              <div className="mt-2">
                <p>Comment</p>
                <textarea
                  value={commentData?.budgetSummaryAttachmentComment || ""}
                  disabled={!setCommentData}
                  onChange={(e) =>
                    handleCommentChange(
                      "budgetSummaryAttachmentComment",
                      e.target.value,
                    )
                  }
                  className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                  placeholder="Add your comment"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            <label
              htmlFor="budgetSummaryAttachment"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {files.budgetSummaryAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {files.budgetSummaryAttachment.name}
                  </p>
                  <p className="text-sm text-gray-500">File selected</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-md text-gray-500">Upload file</p>
                  <p className="text-md text-gray-400">or drag and drop</p>
                </div>
              )}
            </label>
            <input
              id="budgetSummaryAttachment"
              name="budgetSummaryAttachment"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "budgetSummaryAttachment")}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">Budget Line</h3>
        <p className="text-sm text-gray-600"></p>
        {!commentData && renderTrainingProcessInputs()}
        {data?.budgetLines?.length > 0 && (
          <div className="w-full mt-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Budget Line</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Trade</th>
                </tr>
              </thead>
              <tbody>
                {(data?.budgetLines || []).map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="border p-2">{item.budgetLine || "N/A"}</td>
                    <td className="border p-2">{item.amount || "N/A"}</td>
                    <td className="border p-2">
                      {trades.find((trade: any) => trade.value === item.trade)
                        ?.label || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.budgetLines?.length > 0 && (
              <div className=" mt-5">
                <hr className="w-full border border-gray-100" />
                <div className="w-full flex items-center justify-between mt-3">
                  <h1>Total</h1>
                  <p className="font-extrabold">
                    {data?.budgetLines?.reduce(
                      (acc: number, curr: any) =>
                        acc + Number.parseInt(curr.amount || "0", 10),
                      0,
                    ) || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Contribution</h3>
        <p className="text-sm text-gray-600">
          Outline the planned activities to be supported; The skills gap to be
          addressed by the project, the expected outcomes/results, and justify
          why you need the grant to solve it. Explain why this project cannot be
          executed without a grant.
        </p>
        <textarea
          value={data?.contribution || ""}
          onChange={(e) => handleInputChange("contribution", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          readOnly={commentData ? true : false}
          placeholder="Describe your contribution"
        />
        {showComments && commentData && (
          <>
            <p className="text-sm text-gray-600">Comment</p>
            <textarea
              value={commentData?.contributionComment || ""}
              disabled={!setCommentData}
              onChange={(e) =>
                handleCommentChange("contributionComment", e.target.value)
              }
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              placeholder="Add your comment"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetQuestions;
