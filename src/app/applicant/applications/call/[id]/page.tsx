"use client";
import React, { useState } from "react";
import DonutChart from "@/components/chart/DonutChart";
import {
  SolarPen2Bold,
  SolarAddFolderBold,
  SolarShieldWarningBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
  SolarCalendarBold,
  SolarSubtitlesBold,
  SolarDownloadMinimalisticBold,
} from "@/components/core/icons";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import CompleteProfile from "@/components/Modals/application/CompleteProfile";
import { useDisclosure } from "@mantine/hooks";
import AddEditContact from "@/components/Modals/applicantContacts/AddEditContact";
import CreateApplication from "@/components/Modals/application/CreateApplication";
import ProgressCircle from "@/components/CallsList/ProgressBar";
import { unauthorizedApi } from "@/utils/api";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const profile = useSelector((state: any) => state.auth);
  const contacts = useSelector((state: any) => state.contacts);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const { myApplications } = useSelector((state: any) => state.applications);

  const existingApplication = myApplications.find(
    (app: any) => app?.call?.uuid === callId && app.stages.length === 0,
  );
  const [
    isOpenCreateProfile,
    { open: openAddProfile, close: closeAddProfile },
  ] = useDisclosure(false);
  const [isOpenAddContact, { open: openAddContact, close: closeAddContact }] =
    useDisclosure(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [
    isOpenCreateApplication,
    { open: openCreateApplication, close: closeCreateApplication },
  ] = useDisclosure(false);
  const router = useRouter();
  const handleApply = () => {
    setApplyLoading(true);
    if (
      !profile.applicantProfile ||
      !profile.applicantProfile.business_name
    ) {
      openAddProfile();
    } else if (
      !contacts.loading &&
      (!contacts.myContacts || contacts.myContacts.length === 0)
    ) {
      openAddContact();
    } else{
      openCreateApplication();
    }
  };
  const [loading, setLoading] = useState(false);
  const handleDownloadInstructions = async () => {
    setLoading(true);
    try {
      const filename = call.attachment.split("/").pop();

      const response = await unauthorizedApi.get(
        `/admin/download/calls/${filename}`,
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = call.attachment || "downloaded-file.jpg";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };

  if (calls.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl p-10 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Call Info</div>
            <div
              onClick={handleDownloadInstructions}
              className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center"
            >
              <span>
                <SolarDownloadMinimalisticBold />
              </span>
              <p>
                {loading
                  ? "Downloading . . ."
                  : "Download application instructions"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                  <span className="">
                    <SolarAddFolderBold />
                  </span>
                  <div>Title</div>
                </div>
                <p className="text-xl font-bold">{call?.title}</p>
              </div>
              <div className="flex gap-4 items-center ">
                <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                  <span>
                    <SolarShieldWarningBold />
                  </span>
                  <div>Appeal Days</div>
                </div>
                <div className="text-xl font-bold">{call?.appealDays} Days</div>
              </div>
              <div className="flex gap-4 items-center  ">
                <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                  <span>
                    <SolarBookmarkBold />
                  </span>
                  <div>Status</div>
                </div>
                <div className="text-xl font-bold">{call?.status}</div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit ">
                <span className="">
                  <SolarClockSquareBold />
                </span>
                <div>Timeline</div>
              </div>
              <div className="flex gap-4  ">
                <ProgressCircle
                  activeColor="#005DE9"
                  bgColor="#fff"
                  baseColor="#EAEAFC"
                  endDate={call?.endDate}
                  startDate={call?.startDate}
                />
                <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-5 py-5   rounded-3xl items-center justify-center gap-2">
                  <div className="flex gap-2 items-start  w-full ">
                    <span className="text-[#005DE9]">
                      <SolarCalendarBold className="w-7 h-7" />
                    </span>
                    <div>
                      <p className="font-semibold">Start date</p>
                      <p>{call && format(call?.startDate, "dd MMMM yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-start  w-full ">
                    <span className="text-[#005DE9]">
                      <SolarCalendarBold className="w-7 h-7" />
                    </span>
                    <div>
                      <p className="font-semibold">End Date</p>
                      <p>{call && format(call?.endDate, "dd MMMM yyyy")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold w-fit items-center justify-center">
              <span>
                <SolarSubtitlesBold />
              </span>
              <p>Description</p>
            </div>
            <div className=" font-semibold text-gray-400">
              {call?.description}
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={applyLoading}
            className="flex gap-2 text-white bg-[#005DE9] px-4 py-2 rounded-full  w-full font-bold items-center justify-center cursor-pointer"
          >
            <p>
              {applyLoading
                ? "Loading...."
                : existingApplication
                  ? "Create Another Application"
                  : "Apply"}
            </p>
          </button>
        </div>
      </div>
      <CompleteProfile
        closeCompleteProfile={closeAddProfile}
        isOpenCompleteProfile={isOpenCreateProfile}
        finishAddingProfile={() => {
          closeAddProfile();
          if (!contacts.myContacts || contacts.myContacts.length === 0) {
            openAddContact();
          } else {
            router.push(`/applicant/applications/${callId}/apply`);
          }
        }}
      />
      <AddEditContact
        isOpenAddEditContact={isOpenAddContact}
        closeAddEditContact={closeAddContact}
        finishAddingContact={() => {
          closeAddContact();
          openCreateApplication();
        }}
      />
      <CreateApplication
        isOpenCreatingApplication={isOpenCreateApplication}
        closeCreatingApplication={closeCreateApplication}
        call={call}
        existingApplication={existingApplication}
      />
    </div>
  );
};

export default Page;
