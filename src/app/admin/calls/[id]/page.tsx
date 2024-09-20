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
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { format } from "date-fns";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];

const startDate = call?.startDate ? new Date(call.startDate) : null;
const endDate = call?.endDate ? new Date(call.endDate) : null;

let callcloseDays = 0;
if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  callcloseDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
  return (
    <div className="bg-white rounded-2xl p-10 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Call Info</div>
            <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center">
              <span>
                <SolarPen2Bold />
              </span>
              <div>Edit Call</div>
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
                <DonutChart daysLeft={callcloseDays} />
              </div>
              <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-4 py-2 rounded-3xl items-center justify-center font-semibold gap-2">
                <div className="flex gap-2 items-center justify-center">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>start date</p>
                    <p>{call && format(call?.startDate, "dd MMMM yyyy")}</p>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center justify-center">
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
          <div className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center">
            <span>
              <SolarDownloadMinimalisticBold />
            </span>
            <p>View application instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
