import { Comments } from "@/types";
import { handleDownloadFile, handleViewFile } from "@/services";
import { Select } from "@mantine/core";
import { useState } from "react";
import { FaDownload, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export const Page2 = ({
  data,
  setData,
  commentsData,
  setCommentsData,
  type = "training",
  application,
  isApplicant,
}: {
  data: any;
  setData?: any;
  commentsData?: Comments;
  setCommentsData?: any;
  isApplicant?: boolean;

  type?: "training" | "assessment";
  application: any;
}) => {
  const [trainingProcessInputs, setTrainingProcessInputs] = useState({
    moduleName: "",
    from: "",
    to: "",
    numberOfHours: "",
  });
  const [addTrainingError, setAddTrainingError] = useState("");

  const validateTrainingProcessInputs = (): string | null => {
    const { moduleName, from, to, numberOfHours } = trainingProcessInputs;
    let missingFields = [];
    if (!moduleName) missingFields.push("Module Name");
    if (!from) missingFields.push("From Date");
    if (!to) missingFields.push("To Date");
    if (!numberOfHours) missingFields.push("Number of Hours");

    if (missingFields.length > 0) {
      return `Please fill in the following fields: ${missingFields.join(", ")}.`;
    }
    return null;
  };

  const addTrainingProcess = () => {
    const errorMessage = validateTrainingProcessInputs();
    if (errorMessage) {
      setAddTrainingError(errorMessage);
      return;
    }

    setData(type === "assessment" ? "assessmentProcess" : "trainingProcess", [
      ...(type === "assessment"
        ? data.assessmentProcess
        : data.trainingProcess),
      trainingProcessInputs,
    ]);
    setTrainingProcessInputs({
      moduleName: "",
      from: "",
      to: "",
      numberOfHours: "",
    });
    setAddTrainingError("");
  };

  const renderInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label
            htmlFor="moduleName"
            className="block text-sm font-medium text-gray-700"
          >
            Name of Module
          </label>
          <input
            id="moduleName"
            type="text"
            placeholder="Name of Module"
            value={trainingProcessInputs.moduleName}
            onChange={(e) =>
              setTrainingProcessInputs((prev) => ({
                ...prev,
                moduleName: e.target.value,
              }))
            }
            className="mt-2 px-2 py-2.5 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          />
        </div>
        <div>
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700"
          >
            From Date
          </label>
          <input
            id="from"
            type="date"
            placeholder="From Date"
            min={
              new Date(
                typeof application?.call?.endDate === "string"
                  ? new Date(application?.call?.endDate).getTime() +
                    24 * 60 * 60 * 1000
                  : (application?.call?.endDate.getTime() ||
                      new Date().getTime()) +
                    24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split("T")[0]
            }
            value={trainingProcessInputs.from}
            onChange={(e) =>
              setTrainingProcessInputs((prev) => ({
                ...prev,
                from: e.target.value,
                to: "",
              }))
            }
            className="mt-2 px-2 py-2.5 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          />
        </div>
        <div>
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            To Date
          </label>
          <input
            id="to"
            type="date"
            placeholder="To Date"
            min={
              trainingProcessInputs.from
                ? new Date(trainingProcessInputs.from)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            value={trainingProcessInputs.to}
            onChange={(e) =>
              setTrainingProcessInputs((prev) => ({
                ...prev,
                to: e.target.value,
              }))
            }
            className="mt-2 px-2 py-2.5 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          />
        </div>
        <div>
          <label
            htmlFor="numberOfHours"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Hours
          </label>
          <input
            id="numberOfHours"
            type="number"
            placeholder="Number of Hours"
            value={trainingProcessInputs.numberOfHours}
            onChange={(e) =>
              setTrainingProcessInputs((prev) => ({
                ...prev,
                numberOfHours: e.target.value,
              }))
            }
            className="mt-2 px-2 py-2.5 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          />
        </div>
      </div>
      {addTrainingError && <p className="text-red-600">{addTrainingError}</p>}
      <div className="flex justify-end">
        <button
          onClick={addTrainingProcess}
          className="mt-2  py-2.5 bg-primary text-white px-20 rounded-2xl"
        >
          Add
        </button>
      </div>
    </div>
  );

  const renderCommentsSection = (field: string) => (
    <div className="mt-4">
      <h4 className="text-md font-semibold text-gray-700">Comment</h4>
      <textarea
        value={commentsData?.[field as keyof Comments] || ""}
        onChange={(e) => {
          setCommentsData?.({ ...commentsData, [field]: e.target.value });
        }}
        className="mt-2 px-2 py-2.5 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        disabled={!setCommentsData}
      />
    </div>
  );

  return (
    <>
      <div>
        <h3 className="text-lg font-bold">
          {type === "assessment"
            ? "Assessment Process"
            : "Training Delivery Process"}
        </h3>
        <p className="text-sm text-gray-600">
          {type === "assessment"
            ? "Please fill in the details for the assessment process."
            : "Keep in mind that the training period for window 1 should range from a few days to 6 months. Estimate the duration based on the content/modules to be offered."}
        </p>
        {setData && !commentsData && renderInputs()}
        {data?.trainingProcess?.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full w-fit mt-4 border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Module Name</th>
                  <th className="border p-2">From Date</th>
                  <th className="border p-2">To Date</th>
                  <th className="border p-2">Number of Hours</th>
                  {!commentsData && setData && (
                    <th className="border p-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(data?.trainingProcess || []).map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="border p-2">{item.moduleName}</td>
                    <td className="border p-2">
                      {new Date(item.from).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      {new Date(item.to).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{item.numberOfHours}</td>
                    {!commentsData && setData && (
                      <td className="flex items-center justify-center gap-2 border p-3 ">
                        <button
                          className="text-primary"
                          onClick={() => {
                            setTrainingProcessInputs(item);
                            setData(
                              "trainingProcess",
                              data.trainingProcess.filter((process: any) => {
                                return !(
                                  process.moduleName === item.moduleName &&
                                  process.from === item.from &&
                                  process.to === item.to &&
                                  process.numberOfHours === item.numberOfHours
                                );
                              }),
                            );
                          }}
                        >
                          <FaRegEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-danger"
                          onClick={() => {
                            setData(
                              "trainingProcess",
                              data.trainingProcess.filter((process: any) => {
                                return !(
                                  process.moduleName === item.moduleName &&
                                  process.from === item.from &&
                                  process.to === item.to &&
                                  process.numberOfHours === item.numberOfHours
                                );
                              }),
                            );
                          }}
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isApplicant &&
          setCommentsData &&
          renderCommentsSection(
            type === "assessment"
              ? "assessmentProcessComment"
              : "trainingDeliveryComment",
          )}
      </div>
      {type !== "assessment" && (
        <div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-lg font-bold">Training Manual</h3>
            <div className=" text-white bg-primary rounded-full px-10 flex items-center gap-2 py-2 cursor-pointer">
              <FaDownload />
              <p>Download Template</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Please attach a detailed description of the content (training
            manual) of the proposed training.
          </p>
          {commentsData || !setData ? (
            <>
              {data?.trainingManualAttachment ? (
                <div className="grid grid-cols-2 gap-2 my-2">
                  <button
                    onClick={() =>
                      handleViewFile(
                        data?.trainingManualAttachment,
                        "applications",
                      )
                    }
                    className={`bg-gray-200  text-black font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
                  >
                    View File
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(
                        data?.trainingManualAttachment,
                        "applications",
                      )
                    }
                    className={` bg-primary  text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
                  >
                    <FaDownload />
                    <p>Download File</p>
                  </button>
                </div>
              ) : (
                <p>No File found</p>
              )}
            </>
          ) : (
            <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
              <label
                htmlFor="file-upload-trainingManual"
                className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
              >
                <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold">+</span>
                </div>
                {data.trainingManualAttachment ? (
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-700">
                      {typeof data?.trainingManualAttachment === "string"
                        ? data.trainingManualAttachment.split("/").pop()
                        : data?.trainingManualAttachment?.name}
                    </p>
                    <p className="text-sm text-gray-500">{"File selected"}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-md text-gray-500">Upload file</p>
                    <p className="text-md text-gray-400">or drag and drop</p>
                  </div>
                )}
              </label>
              <input
                id="file-upload-trainingManual"
                name="trainingManualAttachment"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) =>
                  setData(
                    "trainingManualAttachment",
                    e.target.files ? e.target.files[0] : null,
                  )
                }
              />
            </div>
          )}
        </div>
      )}
      {!isApplicant &&
        commentsData &&
        renderCommentsSection(
          type === "assessment" ? "assessmentComment" : "trainingManualComment",
        )}
    </>
  );
};
