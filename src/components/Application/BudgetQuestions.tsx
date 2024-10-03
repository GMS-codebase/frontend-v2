import { Comments } from "@/types";
import { ApplicationQuestions } from "@/types/application";
import { handleDownloadFile } from "@/utils/funcs";
import React, { useState, ChangeEvent } from "react";

interface FundingQuestionsProps {
  data: ApplicationQuestions;
  setData?: React.Dispatch<React.SetStateAction<ApplicationQuestions>>;
  commentData?: Comments; 
  setCommentData?: React.Dispatch<React.SetStateAction<Comments>>;
}

const BudgetQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  commentData,
  setCommentData,
}) => {
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});

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

  return (
    <div className="space-y-2">
      <div className="">
        <h3 className="text-lg font-bold">Budget Summary</h3>
        <p className="text-sm text-gray-600">
          Attach a file related to the budget summary
        </p>
        {commentData ? (
          <div className="mt-2">
            <button disabled={data?.budgetSummaryAttachment === null} onClick={()=> handleDownloadFile(data?.budgetSummaryAttachment, "applications")} className={`w-full h-12 ${data?.budgetSummaryAttachment ? "bg-primary":"bg-gray-600"} text-white rounded-full`}>
              {data?.budgetSummaryAttachment ? "Download Budget Summary" : "No Budget Summary Attached"}
            </button>
            <div className="mt-2">
              <p>Comment</p>
              <textarea
                value={commentData?.budgetSummaryAttachmentComment || ""}
                disabled={!setCommentData} 
                onChange={(e) =>
                  handleCommentChange(
                    "budgetSummaryAttachmentComment",
                    e.target.value
                  )
                }
                className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                placeholder="Add your comment"
              />
            </div>
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

      <div className="">
        <h3 className="text-lg font-bold">Contribution</h3>
        <p className="text-sm text-gray-600">
          Outline the planned activities to be supported; The skills gap to be
          addressed by the project, the expected outcomes/results, and justify
          why you need the grant to solve it. Explain why this project cannot be
          executed without a grant.
        </p>
        <textarea
          value={data.contribution || ""}
          onChange={(e) => handleInputChange("contribution", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          readOnly={commentData ? true : false}
          placeholder="Describe your contribution"
        />
                {commentData && <>
                  <p className="text-sm text-gray-600">Comment</p>
                  <textarea
                value={commentData?.contributionComment || ""}
                disabled={!setCommentData} 
                onChange={(e) =>
                  handleCommentChange(
                    "contributionComment",
                    e.target.value
                  )
                }
                className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                placeholder="Add your comment"
              />
        </>}
      </div>
    </div>
  );
};

export default BudgetQuestions;
