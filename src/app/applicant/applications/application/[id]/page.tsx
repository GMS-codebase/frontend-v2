"use client";
import React from "react";
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
import TermsAndConditions from "@/components/Application/TermsAndConditions";
import MinutesNegotiation from "@/components/Application/MinutesNegotiation";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const { myApplications } = useSelector((state: any) => state.applications);
  const existingApplication = myApplications.find(
    (app: any) => app?.uuid === callId,
  );
  console.log(myApplications, existingApplication, callId);
  const router = useRouter();
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
            <div className="flex gap-4 rounded-2xl items-center justify-center ">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Title</div>
              </div>
              <div className="text-xl font-bold">
                {existingApplication?.call?.title}
              </div>
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
              <div className="flex gap-4 rounded-2xl items-center justify-center ">
                <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                  <span>
                    <SolarShieldWarningBold />
                  </span>
                  <div>Appeal Days</div>
                </div>
                <div className="text-xl font-bold">
                  {existingApplication?.call?.appealDays} Days
                </div>
              </div>
              <div className="flex gap-4 items-center justify-center ">
                <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                  <span>
                    <SolarBookmarkBold />
                  </span>
                  <div>Status</div>
                </div>
                <div className="text-xl font-bold">
                  {existingApplication?.call?.status}
                </div>
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
                    <p>
                      {existingApplication?.call &&
                        format(
                          existingApplication?.call?.startDate,
                          "dd MMMM yyyy",
                        )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>End Date</p>
                    <p>
                      {existingApplication?.call &&
                        format(
                          existingApplication?.call?.endDate,
                          "dd MMMM yyyy",
                        )}
                    </p>
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
              {existingApplication?.call?.description}
            </div>
          </div>
          {/* <TermsAndConditions /> */}
          <MinutesNegotiation />
        </div>
      </div>
    </div>
  );
};

export default Page;
