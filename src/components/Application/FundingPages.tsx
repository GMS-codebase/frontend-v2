import React, { useState } from "react";
import { Select } from "@mantine/core";
import { Comments } from "@/types";
import { handleDownloadFile } from "@/utils/funcs";

export const FirstPageQuestions = ({
  data,
  handleInputChange,
  commentData,
  setCommentData,
  showComments,
}: {
  data: any;
  handleInputChange?: any;
  commentData?: Comments;
  setCommentData?: any;
  showComments?: boolean;
}) => {
  const handleCommentChange = (inputName: string, value: any) => {
    if (setCommentData) {
      setCommentData((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  return (
    <>
      <div className="">
        <h3 className="text-lg font-bold">Title of the project</h3>
        <p className="text-sm text-gray-600">
          Please provide the name/title of your project.
        </p>
        <input
          type="text"
          value={data?.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2 ">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={commentData.titleComment || ""}
              onChange={(e) =>
                handleCommentChange("titleComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Project Activities and Expected Outcomes
        </h3>
        <p className="text-sm text-gray-600">
          Outline the planned activities to be supported; The skills gap to be
          addressed by the project, the expected outcomes/results, and justify
          why you need the grant to solve it. Explain why this project cannot be
          executed without a grant.
        </p>
        <textarea
          value={data?.activitiesAndOutcomes || ""}
          onChange={(e) =>
            handleInputChange("activitiesAndOutcomes", e.target.value)
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={commentData.activitiesComment || ""}
              onChange={(e) =>
                handleCommentChange("activitiesComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Readiness to execute the project</h3>
        <p className="text-sm text-gray-600">
          Explain to which extent you are prepared to execute this project.
        </p>
        <textarea
          value={data?.readinessExecute || ""}
          onChange={(e) =>
            handleInputChange("readinessExecute", e.target.value)
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={commentData.readinessExecuteComment || ""}
              onChange={(e) =>
                handleCommentChange("readinessExecuteComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Role of other involved training providers
        </h3>
        <p className="text-sm text-gray-600">
          Explain the role of any other involved training provider in the
          project, if any. Indicate the training provider you would like to
          partner with if any.
        </p>
        <textarea
          value={data?.role || ""}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={commentData.roleComment || ""}
              onChange={(e) =>
                handleCommentChange("roleComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Identification of employees in need of skills upgrading
        </h3>
        <p className="text-sm text-gray-600">
          Provide the number of employees you need to train and their
          background.
        </p>
        <input
          type="number"
          value={data?.identificationEmployee || ""}
          onChange={(e) =>
            handleInputChange("identificationEmployee", e.target.value)
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <input
              type="text"
              value={commentData.identificationEmployeeComment || ""}
              onChange={(e) =>
                handleCommentChange(
                  "identificationEmployeeComment",
                  e.target.value
                )
              }
              className="mt-2 p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
    </>
  );
};

export const TrainingProgress = ({
  data,
  files,
  handleFileChange,
  handleArrayOfObjectsChange,
  trades,
  commentsData,
  setCommentsData,
  showComments,
}: {
  data: any;
  files: any;
  handleFileChange?: any;
  handleArrayOfObjectsChange?: any;
  trades: any;
  commentsData?: Comments;
  setCommentsData?: any;
  showComments?: boolean;
}) => {
  const [trainingProcessInputs, setTrainingProcessInputs] = useState({
    trade: "",
    moduleName: "",
    from: "",
    to: "",
    numberOfHours: "",
  });

  const validateTrainingProcessInputs = () => {
    const { trade, moduleName, from, to, numberOfHours } =
      trainingProcessInputs;
    return trade && moduleName && from && to && numberOfHours;
  };

  const addTrainingProcess = () => {
    if (!validateTrainingProcessInputs()) {
      alert("Please fill in all fields before adding.");
      return;
    }
    handleArrayOfObjectsChange(
      "trainingProcess",
      trainingProcessInputs,
      data?.trainingProcess?.length || 0
    );
    setTrainingProcessInputs({
      trade: "",
      moduleName: "",
      from: "",
      to: "",
      numberOfHours: "",
    });
  };
  const formatedTrades =
    trades?.length && trades[0].uuid
      ? trades?.map((trade: any) => trade.title)
      : trades;

  console.log(data)
  const renderTrainingProcessInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Select
          name="trade"
          value={trainingProcessInputs.trade}
          onChange={(selectedOption) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              trade: selectedOption || "",
            }))
          }
          data={trades}
          className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Select Trade"
        />
        <input
          type="text"
          placeholder="Name of Module"
          value={trainingProcessInputs.moduleName}
          onChange={(e) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              moduleName: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <input
          type="date"
          placeholder="From Date"
          value={trainingProcessInputs.from}
          onChange={(e) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              from: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <input
          type="date"
          placeholder="To Date"
          value={trainingProcessInputs.to}
          onChange={(e) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              to: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <input
          type="number"
          placeholder="Number of Hours"
          value={trainingProcessInputs.numberOfHours}
          onChange={(e) =>
            setTrainingProcessInputs((prev) => ({
              ...prev,
              numberOfHours: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
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

  const renderCommentsSection = (field: string) => (
    <div className="mt-4">
      <h4 className="text-md font-semibold text-gray-700">Comment</h4>
      <textarea
        value={commentsData?.[field as keyof Comments] || ""}
        onChange={(e) =>
          setCommentsData &&
          setCommentsData({ ...commentsData, [field]: e.target.value })
        }
        className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        disabled={!setCommentsData}
      />
    </div>
  );

  return (
    <>
      <div className="p-4">
        <h3 className="text-lg font-bold">Training Delivery Process</h3>
        <p className="text-sm text-gray-600">
          Keep in mind that the training period for window 1 should be ranging
          from few days to 6 months, estimate the training duration with respect
          to the training content/modules to be offered.
        </p>
        {handleArrayOfObjectsChange &&
          !commentsData &&
          renderTrainingProcessInputs()}
        {data?.trainingProcess?.length > 0 && (
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Trade</th>
                <th className="border p-2">Module Name</th>
                <th className="border p-2">From Date</th>
                <th className="border p-2">To Date</th>
                <th className="border p-2">Number of Hours</th>
              </tr>
            </thead>
            <tbody>
              {(data?.trainingProcess || []).map((item: any, index: any) => {
                console.log("Trades --> ", trades, " Item --> ", item);
                return (
                  <tr key={index}>
                    <td className="border p-2">
                      {item.uuid
                        ? trades.find(
                            (trade: any) => trade.value === item?.trade?.uuid
                          )?.label
                        : trades.find(
                            (trade: any) => trade.value === item?.trade
                          )?.label}
                    </td>
                    <td className="border p-2">{item.moduleName}</td>
                    <td className="border p-2">
                      {new Date(item.from).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      {new Date(item.to).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{item.numberOfHours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Training Manual</h3>
        <p className="text-sm text-gray-600">
          Please attach a detailed description of the content (training manual)
          of the proposed training.
        </p>
        {commentsData || !handleFileChange ? (
          <>
            <button
              onClick={() =>
                handleDownloadFile(
                  data?.trainingManualAttachment,
                  "applications"
                )
              }
              className={`w-full h-12 ${data?.trainingManualAttachment ? "bg-primary" : "bg-gray-600"} my-2 text-white font-semibold rounded-full w-full py-2`}
            >
              {data?.trainingManualAttachment
                ? "Download File"
                : "No Manual Found"}
            </button>
            {showComments && renderCommentsSection("trainingManualComment")}
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
              {files.trainingManualAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {files?.trainingManualAttachment?.name}
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
              onChange={(e) => handleFileChange(e, "trainingManualAttachment")}
            />
          </div>
        )}
      </div>
    </>
  );
};

export function TrainingEquipments({
  data,
  files,
  handleFileChange,
  handleArrayOfObjectsChange,
  trades,
  commentsData,
  setCommentsData,
  showComments,
}: {
  data: any;
  files: any;
  handleFileChange?: any;
  handleArrayOfObjectsChange?: any;
  trades: any;
  commentsData?: Comments;
  setCommentsData?: any;
  showComments?: boolean;
}) {
  const [trainingEquipments, setTrainingEquipments] = useState({
    trade: "",
    nameOfEquipment: "",
    numberOfEquipment: "",
  });

  const validateTrainingEquipments = () => {
    const { trade, nameOfEquipment, numberOfEquipment } = trainingEquipments;
    return trade && nameOfEquipment && numberOfEquipment;
  };

  const addTrainingEquipment = () => {
    if (!validateTrainingEquipments()) {
      alert("Please fill in all fields before adding.");
      return;
    }
    handleArrayOfObjectsChange(
      "trainingEquipment",
      trainingEquipments,
      data?.trainingEquipment?.length || 0
    );
    setTrainingEquipments({
      trade: "",
      nameOfEquipment: "",
      numberOfEquipment: "",
    });
  };

  const renderTrainingEquipmentsInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Name of Equipment"
          value={trainingEquipments.nameOfEquipment}
          onChange={(e) =>
            setTrainingEquipments((prev) => ({
              ...prev,
              nameOfEquipment: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <input
          type="number"
          placeholder="Number of Equipments"
          value={trainingEquipments.numberOfEquipment}
          onChange={(e) =>
            setTrainingEquipments((prev) => ({
              ...prev,
              numberOfEquipment: e.target.value,
            }))
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
        <Select
          name="trade"
          value={trainingEquipments.trade}
          onChange={(selectedOption) =>
            setTrainingEquipments((prev) => ({
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
          onClick={addTrainingEquipment}
          className="mt-2 p-2 bg-primary text-white px-20 rounded-2xl"
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
        onChange={(e) =>
          setCommentsData &&
          setCommentsData({ ...commentsData, [field]: e.target.value })
        }
        className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        disabled={!setCommentsData}
      />
    </div>
  );

  return (
    <>
      <div className="p-4">
        <h3 className="text-lg font-bold">Training Equipment</h3>
        <p className="text-sm text-gray-600">
          List down the equipment available to facilitate this training. [Name
          of equipment/Number/Related Trade]
        </p>
        {handleArrayOfObjectsChange &&
          !commentsData &&
          renderTrainingEquipmentsInputs()}
        {data?.trainingEquipment?.length > 0 && (
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Number of Equipment</th>
                <th className="border p-2">Selected Trade</th>
              </tr>
            </thead>
            <tbody>
              {(data?.trainingEquipment || []).map((item: any, index: any) => (
                <tr key={index}>
                  <td className="border p-2">{item.nameOfEquipment}</td>
                  <td className="border p-2">{item.numberOfEquipment}</td>
                  <td className="border p-2">
                    {item.uuid
                      ? trades.find(
                          (trade: any) => trade.value === item?.trade?.uuid
                        )?.label
                      : trades.find((trade: any) => trade.value === item?.trade)
                          ?.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Training Equipment - (Continued)</h3>
        <p className="text-sm text-gray-600">
          Please attach the proof of ownership (Notarized list of equipment,
          Original Invoices (EBM for locally purchased equipment).)
        </p>
        {commentsData || !handleArrayOfObjectsChange ? (
          <>
            <button
              onClick={() =>
                handleDownloadFile(
                  data?.trainingEquipmentAttachment,
                  "applications"
                )
              }
              className={`w-full h-12 ${data?.trainingEquipmentAttachment ? "bg-primary" : "bg-gray-600"} my-2 text-white font-semibold rounded-full w-full py-2`}
            >
              {data?.trainingEquipmentAttachment
                ? "Download File"
                : "No Attachment Found!"}
            </button>
            {showComments &&
              renderCommentsSection("trainingEquipmentAttachmentComment")}
          </>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            <label
              htmlFor="file-upload-trainingEquipmentAttachment"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {files.trainingEquipmentAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {files.trainingEquipmentAttachment.name}
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
              id="file-upload-trainingEquipmentAttachment"
              name="trainingEquipmentAttachment"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                handleFileChange(e, "trainingEquipmentAttachment")
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

export const Staff = ({
  data,
  files,
  handleFileChange,
  handleArrayOfObjectsChange,
  commentData,
  setCommentData,
  showComments,
}: {
  data: any;
  files: any;
  handleFileChange: any;
  handleArrayOfObjectsChange: any;
  commentData?: any;
  setCommentData?: any;
  showComments?: boolean;
}) => {
  const [staffInputs, setStaffInputs] = useState({
    number: "",
    position: "",
    qualification: "",
    available: "",
  });

  const [errors, setErrors] = useState({
    number: "",
    position: "",
    qualification: "",
    available: "",
  });

  const validateStaffInputs = () => {
    const { number, position, qualification, available } = staffInputs;
    const newErrors = {
      number: number ? "" : "Staff number is required.",
      position: position ? "" : "Position is required.",
      qualification: qualification ? "" : "Qualification is required.",
      available: available ? "" : "Availability is required.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const addStaff = () => {
    if (!validateStaffInputs()) {
      return;
    }
    handleArrayOfObjectsChange(
      "staffs",
      staffInputs,
      data?.staffs?.length || 0
    );
    setStaffInputs({
      number: "",
      position: "",
      qualification: "",
      available: "",
    });
    setErrors({
      number: "",
      position: "",
      qualification: "",
      available: "",
    });
  };

  const handleCommentChange = (inputName: string, value: any) => {
    if (setCommentData) {
      setCommentData((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  return (
    <div className="">
      <h3 className="text-lg font-bold">Staff Information</h3>
      <p className="text-sm text-gray-600">
        Add details of the staff involved in the training process.
      </p>
      {handleArrayOfObjectsChange && !commentData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="number"
                placeholder="Number"
                value={staffInputs.number}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    number: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.number ? "border-red-500" : ""
                }`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Position"
                value={staffInputs.position}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.position ? "border-red-500" : ""
                }`}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Qualification"
                value={staffInputs.qualification}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    qualification: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.qualification ? "border-red-500" : ""
                }`}
              />
              {errors.qualification && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qualification}
                </p>
              )}
            </div>
            <div className="relative">
              <Select
                name="available"
                value={staffInputs.available}
                onChange={(value: string | null) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    available: value ?? "",
                  }))
                }
                data={[
                  { value: "available", label: "Available" },
                  { value: "to be hired", label: "To Be Hired" },
                ]}
                className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Select Availability"
              />

              {errors.available && (
                <p className="text-red-500 text-sm mt-1">{errors.available}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addStaff}
              className="mt-2 p-2 bg-primary text-white px-20 rounded-2xl"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {data?.staffs?.length > 0 && (
        <>
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Position</th>
                <th className="border p-2">Number of Staff</th>
                <th className="border p-2">Qualification</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.staffs.map((item: any, index: any) => (
                <tr key={index}>
                  <td className="border p-2">{item.position}</td>
                  <td className="border p-2">{item.number}</td>
                  <td className="border p-2">{item.qualification}</td>
                  <td className="border p-2">
                    {item.available?.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {showComments && commentData && (
        <div className="mt-2">
          <label htmlFor="" className="font-medium text-sm">
            Comment
          </label>
          <textarea
            value={commentData.staffComment || ""}
            onChange={(e) =>
              handleCommentChange("staffComment", e.target.value)
            }
            className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
            disabled={!setCommentData}
          />
        </div>
      )}

      <h3 className="text-lg font-bold">Staffs CVs Attachment</h3>
      <p className="text-sm text-gray-600">
        Please attach the document containing the cvs of the staffs
      </p>
      {commentData ? (
        <>
          <button
            onClick={() =>
              handleDownloadFile(data?.staffAttachment, "applications")
            }
            className={`w-full h-12 ${data?.staffAttachment ? "bg-primary" : "bg-gray-600"} my-2 text-white font-semibold rounded-full w-full py-2`}
          >
            {data?.staffAttachment ? "Download File" : "No Attachment Found!"}
          </button>
          {/* {showComments && renderCommentsSection("staffAttachmentComment")} */}
        </>
      ) : (
        <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
          <label
            htmlFor="file-upload-staffAttachment"
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
          >
            <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">+</span>
            </div>
            {files.staffAttachment ? (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700">
                  {files.staffAttachment.name}
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
            id="file-upload-staffAttachment"
            name="staffAttachment"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "staffAttachment")}
          />
        </div>
      )}
    </div>
  );
};

export const LastPageQuestions = ({
  data,
  handleInputChange,
  files,
  handleFileChange,
  commentData,
  setCommentData,
  showComments,
}: {
  data: any;
  handleInputChange?: any;
  files: any;
  handleFileChange?: any;
  commentData?: Comments;
  setCommentData?: any;
  showComments?: boolean;
}) => {
  return (
    <>
      <div className="">
        <h3 className="text-lg font-bold">Sustainability</h3>
        <p className="text-sm text-gray-600">
          How will your project (the planned training activity) continue after
          this funding?
        </p>
        {
          <textarea
            value={(data && data.sustainability) || ""}
            onChange={(e) =>
              handleInputChange("sustainability", e.target.value)
            }
            className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
            disabled={!!commentData || showComments || !handleInputChange}
          />
        }
        {showComments && commentData && (
          <div className="mt-2">
            <h4 className="text-md font-semibold text-gray-700">Comment</h4>
            <textarea
              value={commentData.sustainabilityComment || ""}
              onChange={(e) =>
                setCommentData &&
                setCommentData({
                  ...commentData,
                  sustainabilityComment: e.target.value,
                })
              }
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Previous financial Report</h3>
        <p className="text-sm text-gray-600">
          Provide the financial report of the previous year.
        </p>
        {(showComments && commentData) || !handleFileChange ? (
          <>
            <button
              onClick={() =>
                handleDownloadFile(
                  data?.previousFinancialReportAttachment,
                  "applications"
                )
              }
              className="bg-primary rounded-2xl  my-2 text-white font-semibold w-full py-2"
            >
              {data?.previousFinancialReportAttachment
                ? "Download File"
                : "No Report Found!"}
            </button>
            {showComments && commentData && (
              <div className="mt-2">
                <h4 className="text-md font-semibold text-gray-700">Comment</h4>
                <textarea
                  value={commentData?.previousFinancialReportComment || ""}
                  onChange={(e) =>
                    setCommentData &&
                    setCommentData({
                      ...commentData,
                      previousFinancialReportComment: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                  disabled={!setCommentData}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            <label
              htmlFor="file-upload-previousFinancialReportAttachment"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {files.previousFinancialReportAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {files.previousFinancialReportAttachment.name}
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
              id="file-upload-previousFinancialReportAttachment"
              name="previousFinancialReportAttachment"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                handleFileChange(e, "previousFinancialReportAttachment")
              }
            />
          </div>
        )}
      </div>

      <div className="">
        <h3 className="text-lg font-bold">Contribution from the applicant</h3>
        <p className="text-sm text-gray-600">
          Justify how your institution will contribute to facilitate the
          training.
        </p>
        <textarea
          value={(data && data.contributionFromApplicant) || ""}
          onChange={(e) =>
            handleInputChange("contributionFromApplicant", e.target.value)
          }
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!commentData || !handleInputChange}
        />
        {showComments && commentData && (
          <div className="mt-2">
            <h4 className="text-md font-semibold text-gray-700">Comment</h4>
            <textarea
              value={commentData.contributionFromApplicantComment || ""}
              onChange={(e) =>
                setCommentData &&
                setCommentData({
                  ...commentData,
                  contributionFromApplicantComment: e.target.value,
                })
              }
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              disabled={!setCommentData}
            />
          </div>
        )}
      </div>
    </>
  );
};
