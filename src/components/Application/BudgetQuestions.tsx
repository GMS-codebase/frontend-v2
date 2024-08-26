import { ApplicationQuestions } from "@/types/application";
import React, { useState, ChangeEvent } from "react";

interface FundingQuestionsProps {
  data: ApplicationQuestions;
  setData: React.Dispatch<React.SetStateAction<any>>;
  mode?: "filling" | "commenting" | "evaluating";
  componentData?: any; // For comments and evaluations
  setComponentData?: React.Dispatch<React.SetStateAction<any>>;
}

const BudgetQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  mode = "filling",
  componentData,
  setComponentData,
}) => {
  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});

  const handleInputChange = (inputName: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [inputName]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setData((prev: any) => ({ ...prev, [key]: file }));
    }
  };

  const handleCommentChange = (inputName: string, value: any) => {
    if (setComponentData) {
      setComponentData((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  return (
    <div className="space-y-2">
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Budget Summary</h3>
        <p className="text-sm text-gray-600">
          Attach a file related to the budget summary
        </p>
        {mode === "evaluating" && data.budgetSummaryAttachment ? (
          <div className="mt-2">
            <button className="w-full h-12 bg-blue-500 text-white rounded-xl">
              Download Budget Summary
            </button>
          </div>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            {mode === "filling" && (
              <>
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
                  onChange={(e) =>
                    handleFileChange(e, "budgetSummaryAttachment")
                  }
                />
              </>
            )}
            {mode === "commenting" && (
              <>
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {data.budgetSummaryAttachment?.name || "No file uploaded"}
                  </p>
                </div>
                <textarea
                  value={componentData?.budgetSummaryAttachment || ""}
                  onChange={(e) =>
                    handleCommentChange(
                      "budgetSummaryAttachment",
                      e.target.value
                    )
                  }
                  className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                  placeholder="Add your comment"
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-white rounded-lg ">
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
          readOnly={mode !== "filling"}
          placeholder="Describe your contribution"
        />
        {mode === "commenting" ||
          (mode === "evaluating" && (
            <div>
              <p>Comment</p>
              <textarea
                value={componentData?.contribution || ""}
                disabled={mode === "evaluating"}
                onChange={(e) =>
                  handleCommentChange("contribution", e.target.value)
                }
                className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                placeholder="Add your comment"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BudgetQuestions;
