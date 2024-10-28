import React, { useState } from "react";
import { Select } from "@mantine/core";
import { Comments } from "@/types";
import { handleDownloadFile } from "@/utils/funcs";

export function Page3({
  data,
  setData,
  commentsData,
  setCommentsData,
  type = "training", // Default to "training"
}: {
  data: any;
  setData?: any;
  commentsData?: Comments;
  setCommentsData?: any;
  type?: "training" | "assessment"; // Type parameter
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
    console.log(data);
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
      <div className="grid grid-cols-3 gap-2">
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
                </tr>
              </thead>
              <tbody>
                {(type !== "assessment"
                  ? data?.trainingEquipment
                  : data.assessmentEquipment
                ).map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="border p-2">{item.nameOfEquipment}</td>
                    <td className="border p-2">{item.numberOfEquipment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        {commentsData || !setData ? (
          <>
            <button
              onClick={() =>
                handleDownloadFile(
                  data?.trainingEquipmentAttachment,
                  "applications",
                )
              }
              className={`w-full h-12 ${data?.trainingEquipmentAttachment ? "bg-primary" : "bg-gray-600"} my-2 text-white font-semibold rounded-full w-full py-2`}
            >
              {data?.trainingEquipmentAttachment
                ? "Download File"
                : "No Attachment Found!"}
            </button>
            {commentsData &&
              renderCommentsSection(
                type === "assessment"
                  ? "assessmentEquipmentAttachmentComment"
                  : "trainingEquipmentAttachmentComment",
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
                    {
                      (type === "assessment"
                        ? data.assessmentEquipmentAttachment
                        : data.trainingEquipmentAttachment
                      ).name
                    }
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
    </>
  );
}
