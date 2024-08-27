import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { SolarFileBold } from "../core/icons";

const DueDiligenceModal = ({
  opened,
  close,
  isEditing, // Add isEditing prop
  onSaveComment, // Add callback for saving comments
}: {
  opened: boolean;
  close: () => void;
  isEditing?: boolean; // Flag for edit mode
  onSaveComment?: (updatedText: string) => void; // Callback for saving
}) => {
  const [text, setText] = useState(
    "The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.",
  );

  const handleSave = () => {
    onSaveComment && onSaveComment(text); // Save the updated comment
  };

  return (
    <Modal
      opened={opened}
      size={"xl"}
      onClose={close}
      withCloseButton={false}
      centered
      className="overflow-y-auto"
      style={{ maxHeight: "90vh" }}
    >
      <div
        className="overflow-y-auto flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative"
        style={{ maxHeight: "80vh" }}
      >
        <div className="absolute right-3 m-4 text-center mt-0">
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex flex-col justify-start items-start gap-6 font-semibold">
          <h1 className="text-xl font-bold">Due Diligency decision details</h1>
          <div className="flex gap-6 justify-start items-start">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Decision
            </p>
            <p className="mt-2">Selected</p>
          </div>
          <div className="flex gap-6 justify-start items-start font-semibold">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Approved number of trainees
            </p>
            <p className="mt-2">7</p>
          </div>
          <div className="flex gap-6 justify-start items-start">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Approved Trades
            </p>
            <p className="mt-2">ART AND CRAFT</p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-6 font-semibold">
          <h1 className="text-xl font-bold">
            Approval personnel{" "}
            <span className="text-sm font-light">
              (people who made approval and confirmation)
            </span>
          </h1>
          <div className="flex gap-6 justify-start items-start">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Iradukunda Octave
            </p>
            <p className="mt-2">Selected</p>
          </div>
          <div className="flex gap-6 justify-start items-start font-semibold">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Hategekimana Aimable
            </p>
            <p className="mt-2">Confirm</p>
          </div>
          <div className="flex gap-6 justify-start items-start">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Mukankubito Rehema
            </p>
            <p className="mt-2">Confirm</p>
          </div>
        </div>

        <div className="mt-5 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            Attachment:
          </label>
          <div className="flex mb-3 justify-center text-center items-center gap-2 px-4 py-2 bg-[#005DE9] rounded-full text-white">
            <span>
              <SolarFileBold />
            </span>
            <div>Download</div>
          </div>
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            Finance Information:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            readOnly
            rows={4}
            className="mt-2 p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            OHS Information:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            readOnly
            rows={4}
            className="mt-2 p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            Equipment:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            readOnly
            rows={4}
            className="mt-2 p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            Workplace:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            readOnly
            rows={4}
            className="mt-2 p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            OHS Information:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            readOnly
            rows={4}
            className="mt-2 p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div className="p-4 w-full">
          <label className="block text-sm text-gray-600" htmlFor="textarea">
            Comment:
          </label>
          <textarea
            id="textarea"
            name="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            readOnly={!isEditing}
            rows={4}
            className={`mt-2 p-2 w-full border border-primary rounded-xl shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DueDiligenceModal;