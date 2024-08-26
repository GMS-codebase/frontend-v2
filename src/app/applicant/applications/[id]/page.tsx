"use client";
import React from "react";
import DonutChart from "../../../../components/chart/DonutChart";
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
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const profile = useSelector((state: any) => state.auth);
  const contacts = useSelector((state: any) => state.contacts);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const [
    isOpenCreateProfile,
    { open: openAddProfile, close: closeAddProfile },
  ] = useDisclosure(false);
  const [isOpenAddContact, { open: openAddContact, close: closeAddContact }] =
    useDisclosure(false);
  const [
    isOpenCreateApplication,
    { open: openCreateApplication, close: closeCreateApplication },
  ] = useDisclosure(false);
  const router = useRouter();
  const handleApply = () => {
    if (!profile.applicantProfile || !profile.applicantProfile.business_name) {
      openAddProfile();
    } else if (
      !contacts.loading &&
      (!contacts.myContacts || contacts.myContacts.length === 0)
    ) {
      openAddContact();
    } else {
      console.log("Here");
      openCreateApplication();
    }
  };
  return (
    <div className="bg-white rounded-2xl p-10 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Call Info</div>
            <div className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center">
              <span>
                <SolarDownloadMinimalisticBold />
              </span>
              <p>View application instructions</p>
            </div>
          </div>
          <div className="flex justify-between w-3/5  font-semibold ">
            <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
              <span className="">
                <SolarAddFolderBold />
              </span>
              <div>Title</div>
            </div>
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center ">
              <span className="">
                <SolarClockSquareBold />
              </span>
              <div>Timeline</div>
            </div>
          </div>
          <div className="flex gap-2 ">
            <div className="flex flex-col gap-6 justify-start items-start ">
              <h1 className="font-bold text-xl">{call?.title}</h1>
              <div className="flex gap-4 rounded-2xl items-center justify-center ">
                <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                  <span>
                    <SolarShieldWarningBold />
                  </span>
                  <div>Appeal Days</div>
                </div>
                <div className="text-xl font-bold">{call?.appealDays} Days</div>
              </div>
              <div className="flex gap-4 items-center justify-center ">
                <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                  <span>
                    <SolarBookmarkBold />
                  </span>
                  <div>Status</div>
                </div>
                <div className="text-xl font-bold">{call?.status}</div>
              </div>
            </div>
            <div className="flex  mr-10">
              <div className="flex  ">
                <DonutChart />
              </div>
              <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-4   rounded-3xl items-center justify-center font-semibold gap-2">
                <div className="flex gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>Start date</p>
                    <p>{call && format(call?.startDate, "dd MMMM yyyy")}</p>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>End Date</p>
                    <p>{call && format(call?.endDate, "dd MMMM yyyy")}</p>
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
          <div
            onClick={handleApply}
            className="flex gap-2 text-white bg-[#005DE9] px-4 py-2 rounded-full  w-full font-bold items-center justify-center cursor-pointer"
          >
            <p>Apply</p>
          </div>
        </div>
      </div>
      <CompleteProfile
        closeCompleteProfile={closeAddProfile}
        isOpenCompleteProfile={isOpenCreateProfile}
        finishAddingProfile={() => {
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
          router.push(`/applicant/applications/${callId}/apply`);
        }}
      />
      <CreateApplication
        isOpenCreatingApplication={isOpenCreateApplication}
        closeCreatingApplication={closeCreateApplication}
        finishCreatingApplication={() => {
          closeCreateApplication();
          router.push(`/applicant/applications/${callId}/apply`);
        }}
        call={call}
      />
    </div>
  );
};

export default Page;
