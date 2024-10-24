import { Comments } from "@/types";
import { ApplicationQuestions } from "@/types/application";
import { handleDownloadFile } from "@/utils/funcs";
import { Select } from "@mantine/core";
import React, { useState, ChangeEvent } from "react";
import { FaDownload } from "react-icons/fa6";

interface Props {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<ApplicationQuestions>>;
  comments?: Comments;
  setComments?: React.Dispatch<React.SetStateAction<Comments>>;
  application?: any;
}

const BudgetQuestions: React.FC<Props> = ({
  data,
  setData,
  comments,
  setComments,
  application,
}) => {
  const trades: any = application?.trades?.map((trade: any) => ({
    label: trade.trade.title,
    value: trade.trade.title,
  }));
  const [budgetLineInputs, setBudgetLineInputs] = useState({
    trade: "",
    amount: 0,
    budgetLine: "",
  });
  const [errors, setErrors] = useState({ trade: "", amount: "", budgetLine: "" });

  const handleArrayOfObjectsChange = (
    inputName: string,
    value: any,
  ) => {
    setData &&
      setData((prev: any) => {
        const newData = [...(prev[inputName] || [])];
        const existingIndex = newData.findIndex(
          (item: any) => item.trade === value.trade && item.budgetLine === value.budgetLine
        );
  
        if (existingIndex !== -1) {
          // Update the amount of the existing entry
          newData[existingIndex].amount += value.amount;
        } else {
          // Add new entry
          newData.push(value);
        }
  
        return {
          ...prev,
          [inputName]: newData,
        };
      });
  };
  
  const validateBudgetLineInputs = () => {
    const newErrors = {
      trade: budgetLineInputs.trade ? "" : "Trade is required.",
      amount: budgetLineInputs.amount > 0 ? "" : "Amount must be greater than zero.",
      budgetLine: budgetLineInputs.budgetLine ? "" : "Budget line is required.",
    };
    setErrors(newErrors);
    return !newErrors.trade && !newErrors.amount && !newErrors.budgetLine;
  };
  
  const addBudgetLine = () => {
    if (!validateBudgetLineInputs()) {
      return;
    }
    handleArrayOfObjectsChange(
      "budgetLines",
      budgetLineInputs,
    );
    setBudgetLineInputs({
      trade: "",
      amount: 0,
      budgetLine: "",
    });
  };
  

  const renderBudgetLineInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label htmlFor="budgetLine" className="block text-sm font-medium text-gray-700">
            Budget Line
          </label>
          <Select
            name="budgetLine"
            value={budgetLineInputs.budgetLine ?? ""}
            onChange={(selectedOption: any) =>
              setBudgetLineInputs((prev) => ({
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
              "Graduation Fees",
              "Stationeries",
              "Certificates",
              "Insurance Cost for trainees",
              "Other Related Training Cost (Communication fees, Mission Allowances, Public Awareness, Cleaning & Security)",
              "Other (Specify)",
            ]}
            className="border pt-2 mt-2 w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Select Budget Line"
          />
          {errors.budgetLine && <p className="text-red-600 text-sm">{errors.budgetLine}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            value={budgetLineInputs.amount}
            onChange={(e) =>
              setBudgetLineInputs((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }))
            }
            className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          />
          {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
        </div>
        <div>
          <label htmlFor="trade" className="block text-sm font-medium text-gray-700">
            Trade
          </label>
          <Select
            id="trade"
            name="trade"
            value={budgetLineInputs.trade ?? ""}
            onChange={(selectedOption: any) =>
              setBudgetLineInputs((prev) => ({
                ...prev,
                trade: selectedOption || "",
              }))
            }
            data={trades}
            className="border pt-2 mt-2 w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Select Trade"
          />
          {errors.trade && <p className="text-red-600 text-sm">{errors.trade}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={addBudgetLine}
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
        {comments || !setData ? (
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
              {data.budgetSummaryAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {data.budgetSummaryAttachment.name}
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
              onChange={(e) => setData((prev:any)=>({...prev,budgetSummaryAttachment:e.target.files ? e.target.files[0] : null }))}
            />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between py-2">
          <h3 className="text-lg font-bold">Budget Line</h3>
          <div className=" text-white bg-primary rounded-full px-10 flex items-center gap-2 py-2 cursor-pointer">
            <FaDownload />
            <p>Template</p>
          </div>
        </div>
        {!comments && setData && renderBudgetLineInputs()}
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
                      {item?.uuid
                        ? trades.find((trade: any) => trade.label === item?.trade?.title)?.label
                        : trades.find((trade: any) => trade.value === item?.trade)?.label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.budgetLines?.length > 0 && (
              <div className="mt-5">
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
        { !setData && comments && (
          <div className="mt-2">
            <p>Comment</p>
            <textarea
              value={comments?.budgetSummaryAttachmentComment || ""}
              disabled={!setComments}
              onChange={(e) => setComments &&  setComments((prev:any)=>({...prev,budgetSummaryAttachmentComment:e.target.value }))}
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              placeholder="Add your comment"
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
          value={data?.contribution || ""}
          onChange={(e) => setData && setData((prev:any)=>({...prev,contribution:e.target.value }))}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
          placeholder="Describe your contribution"
        />
        {comments && (
          <>
            <p className="text-sm text-gray-600">Comment</p>
            <textarea
              value={comments?.contributionComment || ""}
              disabled={!setComments}
              onChange={(e) => setComments &&  setComments((prev:any)=>({...prev,contributionComment:e.target.value }))}
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
