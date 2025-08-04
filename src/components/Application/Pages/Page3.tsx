import React, { useState } from "react";
import { Select } from "@mantine/core";
import { Comments } from "@/types";
import { handleDownloadFile, handleViewFile } from "@/services";
import { FaDownload, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export function Page3({
  data,
  setData,
  commentsData,
  setCommentsData,
  type = "training", // Default to "training"
  isApplicant,
}: {
  data: any;
  setData?: any;
  commentsData?: Comments;
  setCommentsData?: any;
  type?: "training" | "assessment"; // Type parameter
  isApplicant?: boolean;
}) {
  const [trainingEquipments, setTrainingEquipments] = useState({
    nameOfEquipment: "",
    numberOfEquipment: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const validateTrainingEquipments = () => {
    const { nameOfEquipment, numberOfEquipment } = trainingEquipments;
    if (!nameOfEquipment || !numberOfEquipment) {
      setErrorMessage("Please fill in all fields before adding.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const addTrainingEquipment = () => {
    if (!validateTrainingEquipments()) {
      return;
    }

    setData(
      type === "assessment" ? "assessmentEquipment" : "trainingEquipment",
      [
        ...(type === "assessment"
          ? data.assessmentEquipment
          : data.trainingEquipment),
        trainingEquipments,
      ],
    );

    setTrainingEquipments({
      nameOfEquipment: "",
      numberOfEquipment: "",
    });
  };

  const renderTrainingEquipmentsInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="nameOfEquipment"
            className="block text-sm font-medium text-gray-700"
          >
            Name of Equipment
          </label>
          <input
            id="nameOfEquipment"
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
        </div>
        <div>
          <label
            htmlFor="numberOfEquipment"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Equipment
          </label>
          <input
            id="numberOfEquipment"
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
        </div>
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
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
      <div className="">
        <h3 className="text-lg font-bold capitalize">{type} Equipment</h3>
        <p className="text-sm text-gray-600">
          List down the equipment available to facilitate this {type}. [Name of
          equipment/Number/Related Trade]
        </p>
        {setData && !commentsData && renderTrainingEquipmentsInputs()}
        {(type !== "assessment"
          ? data?.trainingEquipment
          : data.assessmentEquipment
        )?.length > 0 && (
          <div className="w-full overflow-y-auto">
            <table className="min-w-full w-fit mt-4 border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Number of Equipment</th>
                  {!commentsData && setData && (
                    <th className="border p-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(type !== "assessment"
                  ? data?.trainingEquipment
                  : data?.assessmentEquipment
                ).map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="border p-2">{item.nameOfEquipment}</td>
                    <td className="border p-2">{item.numberOfEquipment}</td>
                    {!commentsData && setData && (
                      <td className="flex items-center justify-center gap-2 border p-3">
                        <button
                          className="text-primary"
                          onClick={() => {
                            setTrainingEquipments(item);
                            setData(
                              type !== "assessment"
                                ? "trainingEquipment"
                                : "assessmentEquipment",
                              (type !== "assessment"
                                ? data.trainingEquipment
                                : data.assessmentEquipment
                              ).filter((process: any) => {
                                return !(
                                  process.nameOfEquipment ===
                                    item.nameOfEquipment &&
                                  process.numberOfEquipment ===
                                    item.numberOfEquipment
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
                              type !== "assessment"
                                ? "trainingEquipment"
                                : "assessmentEquipment",
                              (type !== "assessment"
                                ? data.trainingEquipment
                                : data.assessmentEquipment
                              ).filter((process: any) => {
                                return !(
                                  process.nameOfEquipment ===
                                    item.nameOfEquipment &&
                                  process.numberOfEquipment ===
                                    item.numberOfEquipment
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
          commentsData &&
          renderCommentsSection(
            type === "assessment"
              ? "assessmentEquipmentsComment"
              : "trainingEquipmentsComment",
          )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold capitalize">
          {type} Equipment - (Continued)
        </h3>
        <p className="text-sm text-gray-600">
          Please attach the proof of ownership (Notarized list of equipment,
          Original Invoices (EBM for locally purchased equipment).)
        </p>
        {(!isApplicant && commentsData) || !setData ? (
          <>
            <div className="grid grid-cols-2 gap-2 my-2">
              <button
                onClick={() =>
                  handleViewFile(
                    data?.trainingEquipmentAttachment,
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
                    data?.trainingEquipmentAttachment,
                    "applications",
                  )
                }
                className={` bg-primary  text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
              >
                <FaDownload />
                <p>Download File</p>
              </button>
            </div>
            {!isApplicant &&
              commentsData &&
              renderCommentsSection(
                type === "assessment"
                  ? "assessmentEquipmentComment"
                  : "trainingEquipmentComment",
              )}
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
              {(
                type === "assessment"
                  ? data.assessmentEquipmentAttachment
                  : data.trainingEquipmentAttachment
              ) ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {type}
                    {typeof (type === "assessment"
                      ? data?.assessmentEquipmentAttachment
                      : data?.trainingEquipmentAttachment) === "string"
                      ? (type === "assessment"
                          ? data.assessmentEquipmentAttachment
                          : data.trainingEquipmentAttachment
                        )
                          .split("/")
                          .pop()
                      : type === "assessment"
                        ? data?.assessmentEquipmentAttachment?.name
                        : data?.trainingEquipmentAttachment?.name}
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
                setData(
                  type !== "assessment"
                    ? "trainingEquipmentAttachment"
                    : "assessmentEquipmentAttachment",
                  e.target.files ? e.target.files[0] : null,
                )
              }
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold capitalize">Premises Attachment</h3>
        <p className="text-sm text-gray-600">
          Please attach the proof of ownership (Notarized list of equipment,
          Original Invoices (EBM for locally purchased equipment).) of the
          premises used in training
        </p>
        {(!isApplicant && commentsData) || !setData ? (
          <>
            <div className="grid grid-cols-2 gap-2 my-2">
              <button
                onClick={() =>
                  handleViewFile(data?.premisesAttachment, "applications")
                }
                className={`bg-gray-200  text-black font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
              >
                View File
              </button>
              <button
                onClick={() =>
                  handleDownloadFile(data?.premisesAttachment, "applications")
                }
                className={` bg-primary  text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
              >
                <FaDownload />
                <p>Download File</p>
              </button>
            </div>

            {!isApplicant &&
              commentsData &&
              renderCommentsSection("premisesAttachmentComment")}
          </>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            <label
              htmlFor="file-upload-premisesAttachment"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {data.premisesAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {typeof data?.premisesAttachment === "string"
                      ? data.premisesAttachment.split("/").pop()
                      : data?.premisesAttachment?.name}
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
              id="file-upload-premisesAttachment"
              name="premisesAttachment"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                setData(
                  "premisesAttachment",
                  e.target.files ? e.target.files[0] : null,
                )
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
