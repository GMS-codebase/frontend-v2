/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import CustomBarChart from "@/components/core/charts/CustomBarChart";
import {
  SolarBenzeneRingBroken,
  SolarCalendarBold,
  SolarFileBold,
} from "@/components/core/icons";
import { Select, Skeleton } from "@mantine/core";
import dashVector from "@/assets/Vectors/dashVector.png";
import DashboardLineChart from "@/components/core/charts/DashboardLineChart";
import Image from "next/image";
import ProgressGender from "./progressGender";
import BasicGauges from "./BasicGauges";
import Dash from "./dash";
import AdminAction from "@/components/Actions/AdminAction";
import { authorizedApi } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "@/services";

const lineChartData = [
  { day: "Mon", completed: 60, ongoing: 30 },
  { day: "Tue", completed: 70, ongoing: 50 },
  { day: "Wed", completed: 80, ongoing: 40 },
  { day: "Thu", completed: 50, ongoing: 70 },
  { day: "Fri", completed: 90, ongoing: 60 },
  { day: "Sat", completed: 40, ongoing: 30 },
  { day: "Sun", completed: 80, ongoing: 90 },
];

const transformedData = {
  labels: lineChartData.map((item) => item.day),
  datasets: [
    {
      label: "Completed",
      data: lineChartData.map((item) => item.completed),
      borderColor: "#005DE9",
      backgroundColor: "#005DE9",
      fill: true,
    },
    {
      label: "Ongoing",
      data: lineChartData.map((item) => item.ongoing),
      borderColor: "#FF5722",
      backgroundColor: "#FF5722",
      fill: true,
    },
  ],
};

const Page = () => {
  const boysCount = 20;
  const girlsCount = 15;
  const totalCount = boysCount + girlsCount;
  const startDate = "2023-05-01";
  const endDate = "2023-12-31";
  const { data: dashboardData, loading } = useSelector(
    (state: any) => state.dashboard,
  );
  const { sectorsData } = useSelector((state: any) => state.dashboard);
  const companyApplicants = 12345;
  const schoolApplicants = 11123;
  const totalApplicants = companyApplicants + schoolApplicants;
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const [call, setCall] = useState("");
  const { calls } = useSelector((state: any) => state.calls);
  const [stage, setStage] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDashboardData = async () => {
      await getDashboardData(dispatch, call, stage);
    };
    fetchDashboardData();
  }, [call, dispatch, stage]);

  const dashTablesData = [
    {
      sector: "Manufacturing",
      col1Data: sectorsData["Manufacturing"]?.countApplicants,
      col2Data: sectorsData["Manufacturing"]?.countApplicants,
    },
    {
      sector: "Hospitality & Tourism",
      col1Data: sectorsData["Hospitality & Tourism"]?.countApplicants,
      col2Data: sectorsData["Hospitality & Tourism"]?.countApplicants,
    },
    {
      sector: "Transport & Logistics",
      col1Data: sectorsData["Transport & Logistics"]?.countApplicants,
      col2Data: sectorsData["Transport & Logistics"]?.countApplicants,
    },
    {
      sector: "Agriculture",
      col1Data: sectorsData["Agriculture"]?.countApplicants,
      col2Data: sectorsData["Agriculture"]?.countApplicants,
    },
    {
      sector: "Energy",
      col1Data: sectorsData["Energy"]?.countApplicants,
      col2Data: sectorsData["Energy"]?.countApplicants,
    },
    {
      sector: "Mining",
      col1Data: sectorsData["Mining"]?.countApplicants,
      col2Data: sectorsData["Mining"]?.countApplicants,
    },
    {
      sector: "ICT & Digital Skills",
      col1Data: sectorsData["Mining"]?.countApplicants,
      col2Data: sectorsData["Mining"]?.countApplicants,
    },
    {
      sector: "Construction",
      col1Data: sectorsData["Mining"]?.countApplicants,
      col2Data: sectorsData["Mining"]?.countApplicants,
    },
    {
      sector: "Other",
      col1Data: sectorsData["Mining"]?.countApplicants,
      col2Data: sectorsData["Mining"]?.countApplicants,
    },
    {
      sector: "Total",
      col1Data: sectorsData["Mining"]?.countApplicants,
      col2Data: sectorsData["Mining"]?.countApplicants,
    },
  ];

  return (
    <div className="w-full text-secondaryText pb-20 overflow-y-auto">
      {loading ? (
        <Skeleton w={"100%"} h={1000} />
      ) : (
        <>
          <div className="flex flex-col mb-4">
            <div className="flex justify-between">
              <p>Evaluation</p>
              <div className="text-md gap-2 flex self-end">
                <div className="rounded-full border-black-1">
                  <select
                    value={call}
                    onChange={(e: any) => setCall(e.target.value)}
                    className="p-2 border border-1 border-black rounded-full text-md"
                  >
                    {calls.map((call: any, index: number) => (
                      <option key={index} value={call.uuid}>
                        {call.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="bg-white p-6 rounded-2xl flex-grow">
              <h2 className="text-lg font-semibold mb-4">
                Applicants per Priority Sector
              </h2>
              {[
                {
                  sector: "Manufacturing",
                },
                {
                  sector: "Hospitality & Tourism",
                },
                {
                  sector: "Transport & Logistics",
                },
                {
                  sector: "Agriculture",
                },
                {
                  sector: "Energy",
                },
                {
                  sector: "Mining",
                },
                {
                  sector: "ICT & Digital Skills",
                },
                {
                  sector: "Construction",
                },
                {
                  sector: "Other",
                },
                {
                  sector: "Total",
                },
              ]?.map((sector: any, index: any) => (
                <div
                  key={index}
                  className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                >
                  <span className="text-base">{sector?.sector}</span>
                  <span className="text-base bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                    {sectorsData[sector?.sector]?.countApplicants}
                  </span>
                </div>
              ))}
            </div>

            {/* <div className="bg-white p-6 rounded-2xl flex-grow relative">
              <div className="flex justify-between items-center mb-8">
                <p className="text-xl font-medium">Selected Applicants</p>
                <div className="rounded-full border-black-1">
                  <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                    <option value="select-level">evaluation </option>
                  </select>
                </div>
              </div>
              <p className="text-primary text-7xl font-extrabold">
                {dashboardData?.totalApplicants}
              </p>
              <Image
                src={dashVector}
                alt="dash vector"
                className="absolute right-0 bottom-0 rounded-b-2xl"
              />
            </div> */}
            <div className=" bg-white rounded-2xl w-[25%] p-6 flex-grow">
              <div className="flex justify-end ">
                <div className="rounded-full border-black-1">
                  <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                    <option value="select-level">evaluation</option>
                  </select>
                </div>
              </div>
              <div className="my-5">
                <ProgressGender
                  callId={call}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl flex-grow p-4">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-8">Total Applicants</h2>
                <div className="rounded-full border-black-1">
                  <select className="py-2 px-4 border border-1 rounded-full border-gray-400  text-gray-400 text-md">
                    <option value="select-level">All</option>
                  </select>
                </div>
              </div>
              <div className="h-[90%] rounded-lg flex flex-col gap-3">
                <BasicGauges totalApplicants={dashboardData?.totalApplicants} />
              </div>
            </div>
          </div>

          {/* <p className="my-3">Overview</p>
          <div className="flex items-center gap-2">
            <div className="w-full bg-white rounded-2xl shadow p-3">
              <div className="flex justify-between">
                <p className="text-xl font-medium">SDF Graduates Per Year</p>
                <div className="rounded-full border-black-1">
                  <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                    <option value="select-level">construction</option>
                  </select>
                </div>
              </div>
              <DashboardLineChart data={transformedData} />
            </div>
          </div> */}
          <div className=" flex justify-between items-center">
            <div>Priority Sector Analysis</div>
            <div className="flex gap-2 bg-[#005de9] px-24 py-2 rounded-full text-white items-center justify-center p-4 mt-4">
              <span>
                <SolarFileBold />
              </span>
              Export as excel
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 grid-rows-3 gap-6 w-full">
            <div className="bg-white p-6 rounded-2xl">
              <div className="flex justify-between">
                <p>Number of submission</p>
                <div className="text-xl">
                  <AdminAction call={null} setIsCall={() => {}} />{" "}
                </div>
              </div>
              <Dash
                col1="Applicants"
                col2="Applications"
                data={dashTablesData}
              />
            </div>
            <div className="bg-white p-6 rounded-2sm">
              <div className="flex justify-between">
                <p>Applications</p>
                <div className="text-md gap-4 flex items-center justify-center">
                  <div className="rounded-full bg-slate-400 bg-opacity-10">
                    <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                      <span className="text-gray-400">
                        <SolarBenzeneRingBroken />
                      </span>
                      <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                        <option value="select-stage">All</option>
                        <option value="select-stage">Evaluation</option>
                        <option value="select-stage">Due Diligency</option>
                        <option value="select-stage">Grant Committee</option>
                        <option value="select-stage">Contract Signing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <AdminAction call={null} setIsCall={() => {}} />{" "}
                  </div>
                </div>
              </div>
              <Dash col1="Selected" col2="Rejected" data={dashTablesData} />
            </div>
            <div className="bg-white p-6 rounded-2sm">
              <div className="flex justify-between">
                <p>Applicants</p>
                <div className="text-md gap-4 flex items-center justify-center">
                  <div className="rounded-full bg-slate-400 bg-opacity-10">
                    <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                      <span className="text-gray-400">
                        <SolarBenzeneRingBroken />
                      </span>
                      <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                        <option value="select-stage">All</option>
                        <option value="select-stage">Evaluation</option>
                        <option value="select-stage">Due Diligency</option>
                        <option value="select-stage">Grant Committee</option>
                        <option value="select-stage">Contract Signing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <AdminAction call={null} setIsCall={() => {}} />{" "}
                  </div>
                </div>
              </div>
              <Dash col1="Selected" col2="Rejected" data={dashTablesData} />
            </div>
            <div className="bg-white p-6 rounded-2sm">
              <div className="flex justify-between">
                <p>Selected Trainees</p>
                <div className="text-md gap-4 flex items-center justify-center">
                  <div className="rounded-full bg-slate-400 bg-opacity-10">
                    <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                      <span className="text-gray-400">
                        <SolarBenzeneRingBroken />
                      </span>
                      <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                        <option value="select-stage">All</option>
                        <option value="select-stage">Evaluation</option>
                        <option value="select-stage">Due Diligency</option>
                        <option value="select-stage">Grant Committee</option>
                        <option value="select-stage">Contract Signing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <AdminAction call={null} setIsCall={() => {}} />{" "}
                  </div>
                </div>
              </div>
              <Dash col1="Number" data={dashTablesData} showSingleRow={true} />
            </div>
            <div className="bg-white p-6 rounded-2xl">
              <div className="flex justify-between gap-3 w-full">
                <p className="w-full">
                  Number of graduates trainees before 2025
                </p>
                <div className="rounded-full bg-slate-400 bg-opacity-10 w-[40%] px-3">
                  <label
                    htmlFor="call"
                    className="w-full flex items-center py-2 gap-2 rounded-full"
                  >
                    <span id="call" className="text-gray-400">
                      <SolarBenzeneRingBroken />
                    </span>
                    <select
                      id="call"
                      className="w-full px-0 rounded-full text-md bg-transparent outline-none border-none appearance-none"
                    >
                      <option value="call1">Call 1</option>
                      <option value="call1">Call 2</option>
                      <option value="call1">Call 3</option>
                      <option value="call1">Call 4</option>
                      <option value="call1">Call 5</option>
                      <option value="call1">NEET 1</option>
                    </select>
                  </label>
                </div>
                <div className="text-md gap-4 flex items-center justify-center">
                  <div>
                    <AdminAction call={null} setIsCall={() => {}} />{" "}
                  </div>
                </div>
              </div>
              <Dash col1="Male" col2="Female" data={dashTablesData} />
            </div>
            <div className="bg-white p-6 rounded-2xl">
              <div className=" justify-center items-center">
                <p>Number of Trainees Starting from 2025</p>
                <div className="text-md gap-2 flex my-2 ">
                  <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
                    <span className="text-gray-400">
                      <SolarCalendarBold />
                    </span>
                    <p className="text-xs">Starting date</p>
                  </div>
                  <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
                    <span className="text-gray-400">
                      <SolarCalendarBold />
                    </span>
                    <p className="text-xs">Ending date</p>
                  </div>
                  <div className="rounded-full bg-slate-400 bg-opacity-10">
                    <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                      <span className="text-gray-400">
                        <SolarBenzeneRingBroken />
                      </span>
                      <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none text-xs">
                        <option value="select-stage">All</option>
                        <option value="select-stage">Ongoing</option>
                        <option value="select-stage">Completed</option>
                        <option value="select-stage">Graduated</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <AdminAction call={null} setIsCall={() => {}} />{" "}
                  </div>
                </div>
              </div>
              <Dash col1="Male" col2="Female" data={dashTablesData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
