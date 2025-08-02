"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import MakeDecision from "./MakeDecision";
import { SolarFileBold } from "../core/icons";
import { handleDownloadFile } from "@/services";

const GrantCommitteeDetails = ({
  application,
  opened,
  close,
  viewer,
}: {
  application: any;
  opened: boolean;
  close: () => void;
  viewer?: string;
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
        <div className="flex w-[45vw]  max-h-[90vh] overflow-y-auto flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
          <div className="absolute right-3 m-4 text-center mt-0">
            <button
              onClick={close}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="flex flex-col justify-start items-start gap-6 font-semibold">
            <h1 className="text-xl font-bold">
              Grant Committee decision details
            </h1>
          </div>
          {viewer !== "applicant" && (
            <div className="flex gap-6 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Approved trainees
              </p>
              <p className="text-xl">
                {application?.grantCommitteeDecision?.numberOfTrainees}
              </p>
            </div>
          )}
          <p
            className={`px-4 py-2 rounded-full w-fit  flex gap-2 justify-start items-start ${
              application?.grantCommitteeDecision?.decision === "APPROVED"
                ? "bg-lime-500 bg-opacity-10 text-green-500"
                : application?.grantCommitteeDecision?.decision === "REJECTED"
                  ? "bg-red-500 bg-opacity-10 text-danger"
                  : ""
            }`}
          >
            {application?.grantCommitteeDecision?.decision}
          </p>
          <div className="p-2 mt-2 w-full">
            <label className="block text-sm text-gray-600">Comment:</label>
            <textarea
              value={application?.grantCommitteeDecision?.comment}
              disabled
              rows={2}
              className={`mt-2 p-2 w-full border border-gray-500 rounded-xl shadow-sm `}
            />
          </div>
          {viewer !== "applicant" && (
            <>
              {application?.grantCommitteeDecision?.attachment && (
                <div className="mt-5 w-full r">
                  <label
                    className="block text-sm text-gray-600"
                    htmlFor="textarea"
                  >
                    Attachment:
                  </label>
                  <div
                    className="flex mb-3 cursor-pointer justify-center text-center items-center gap-2 px-4 py-2 bg-[#005DE9] rounded-full text-white"
                    onClick={() =>
                      handleDownloadFile(
                        application?.grantCommitteeDecision?.attachment,
                        "GrantCommitteeAttachments",
                      )
                    }
                  >
                    <span>
                      <SolarFileBold />
                    </span>
                    <div>Download</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
      <MakeDecision
        onMakeDecision={() => closeEditDecision()}
        close={closeEditDecision}
        isOpen={isOpenEditDecision}
        type="Due Diligence"
        defaultData={selectedDecision}
      />
    </>
  );
};

export default GrantCommitteeDetails;
