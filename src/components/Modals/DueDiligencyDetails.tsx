"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import MakeDecision from "./MakeDecision";
import { SolarFileBold } from "../core/icons";

const DueDiligencyDetails = ({
  decisions,
  application,
  opened,
  close,
  isEditing,
  onSaveComment,
  viewer,
}: {
  decisions: any;
  application: any;
  opened: boolean;
  close: () => void;
  isEditing?: boolean;
  viewer?: string;
  onSaveComment?: (updatedText: string) => void;
}) => {
  const [
    isOpenEditDecision,
    { open: openEditDecision, close: closeEditDecision },
  ] = useDisclosure(false);
  const [selectedDecision, setSelectedDecision] = useState<any>();
  const profile = useSelector((state: any) => state.auth);
  const [text, setText] = useState(
    "The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.",
  );

  const handleSave = () => {
    onSaveComment && onSaveComment(text);
  };

  return (
    <>
      <Modal
        opened={opened}
        size={""}
        onClose={close}
        withCloseButton={false}
        centered
        className="flex flex-col gap-4 rounded-full"
      >
        <div className="flex max-h-[90vh] overflow-y-auto flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
          <div className="absolute right-3 m-4 text-center mt-0">
            <button
              onClick={close}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="flex flex-col justify-start items-start gap-6 font-semibold">
            <h1 className="text-xl font-bold">DueDiligency decision details</h1>
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
              value={application?.duediligencyForm?.financeInfo}
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
              value={application?.duediligencyForm?.equipmentInfo}
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
              value={application?.duediligencyForm?.workPlaceInfo}
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
              value={application?.duediligencyForm?.ohsInfo}
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
              value={application?.duediligencyForm?.comment}
              onChange={(e) => setText(e.target.value)}
              readOnly={!isEditing}
              rows={4}
              className={`mt-2 p-2 w-full border border-primary rounded-xl shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-6 font-semibold">
            <h1 className="text-xl font-bold">
              Approval personnel{" "}
              <span className="text-sm font-light">
                (people who made approval and confirmation)
              </span>
            </h1>
            {decisions?.length &&
              [...decisions].reverse().map((evaluation: any, i: any) => (
                <div key={i} className="w-full ">
                  <div className="flex gap-6 justify-start items-start">
                    <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                      {evaluation?.employee?.name}
                    </p>
                    {i === 0 && <p className="mt-2">Selected</p>}
                    <p
                      className={` px-4 py-2 rounded-full flex gap-2 justify-start items-start ${
                        evaluation?.decision === "APPROVED"
                          ? "bg-green bg-opacity-10 text-green"
                          : evaluation?.decision === "REJECTED" &&
                            "bg-red-500 bg-opacity-10 text-danger"
                      }`}
                    >
                      {evaluation?.decision}
                    </p>
                    {evaluation?.employee?.user_id ==
                      profile?.userProfile?.data?.uuid && (
                      <button
                        className="bg-primary p-2 rounded-full text-white font-bold"
                        onClick={() => {
                          setSelectedDecision(evaluation);
                          openEditDecision();
                        }}
                      >
                        <CiEdit />
                      </button>
                    )}
                  </div>
                  <div className="p-2 mt-2 w-full">
                    <label className="block text-sm text-gray-600">
                      Comment:
                    </label>
                    <textarea
                      value={evaluation?.comment}
                      disabled
                      rows={2}
                      className={`mt-2 p-2 w-full border border-gray-500  rounded-xl shadow-sm  ${
                        isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
      <MakeDecision
        onMakeDecision={() => closeEditDecision()}
        close={closeEditDecision}
        isOpen={isOpenEditDecision}
        type="Due Diligence"
        defaultData={selectedDecision?.evaluationDecision}
      />
    </>
  );
};

export default DueDiligencyDetails;
