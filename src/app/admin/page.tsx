"use client";
import React, { useState } from "react";
import CustomBarChart from "@/components/core/charts/CustomBarChart";
import {
  SolarBenzeneRingBroken,
  SolarCalendarBold,
  SolarFileBold,
} from "@/components/core/icons";
import { Select } from "@mantine/core";
import dashVector from "@/assets/Vectors/dashVector.png";
import DashboardLineChart from "@/components/core/charts/DashboardLineChart";
import Image from "next/image";
import ProgressGender from "./progressGender";
import BasicGauges from "./BasicGauges";
import Dash from "./dash";
import AdminAction from "@/components/Actions/AdminAction"; // Importing the AdminAction component

// Data for line chart and bar chart
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


  const applicantData = [
      { col1Data: 112, col2Data: 1090 },
      { col1Data: 207, col2Data: 123 },
      { col1Data: 345, col2Data: 149 },
  ];

const Page = () => {
  const boysCount = 20;
  const girlsCount = 15;
  const totalCount = boysCount + girlsCount;

  const startDate = "2023-05-01";
  const endDate = "2023-12-31";

  const companyApplicants = 80;
  const schoolApplicants = 60;
  const totalApplicants = companyApplicants + schoolApplicants;
  const [selectedOption, setSelectedOption] = useState("Option 1");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
      <div className="w-full text-secondaryText pb-20 overflow-y-auto">
          <div className="flex flex-col mb-4">
              <div className="flex justify-between">
                  <p>Evaluation</p>
                  <div className="text-md gap-2 flex">
                      <div className="rounded-full border-black-1">
                          <select className="p-2 border border-1 border-black rounded-full text-md">
                              <option value="select-level">
                                  SDF CALL 5 FOR GRANT PROPOSALS
                              </option>
                              <option value="select-level">
                                  SDF CALL 5 FOR GRANT PROPOSALS
                              </option>
                              <option value="select-level">
                                  SDF CALL 5 FOR GRANT PROPOSALS
                              </option>
                              <option value="select-level">
                                  SDF CALL 5 FOR GRANT PROPOSALS
                              </option>
                          </select>
                      </div>
                  </div>
              </div>
          </div>

          {/* Flexbox layout for the main section */}
          <div className="mt-8 flex flex-wrap gap-6">
              <div className="bg-white p-6 rounded-2xl flex-grow">
                  <h2 className="text-lg font-semibold mb-4">
                      Applicants per Priority Sector
                  </h2>
                  {[
                      { name: "Culinary Programs", count: 32 },
                      { name: "Tech Innovators", count: 14 },
                      { name: "Masonry Internships", count: 20 },
                      { name: "Culinary Workshops", count: 8 },
                  ].map((sector, index) => (
                      <div
                          key={index}
                          className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                      >
                          <span className="text-base">{sector.name}</span>
                          <span className="text-base bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                              {sector.count}
                          </span>
                      </div>
                  ))}
              </div>

              <div className="bg-white p-6 rounded-2xl flex-grow relative">
                  <div className="flex justify-between items-center mb-8">
                      <p className="text-xl font-medium">
                          SDF Graduates Per Year
                      </p>
                      <div className="rounded-full border-black-1">
                          <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                              <option value="select-level">evaluation </option>
                          </select>
                      </div>
                  </div>
                  <p className="text-primary text-7xl font-extrabold">13’032</p>
                  <Image
                      src={dashVector}
                      alt="dash vector"
                      className="absolute right-0 bottom-0 rounded-b-2xl"
                  />
              </div>

              <div className="bg-white rounded-2xl flex-grow p-4">
                  <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-8">
                          Total Applications
                      </h2>
                      <div className="rounded-full border-black-1">
                          <select className="py-2 px-4 border border-1 rounded-full border-gray-400  text-gray-400 text-md">
                              <option value="select-level">All</option>
                          </select>
                      </div>
                  </div>
                  <div className="flex flex-col gap-3">
                      <BasicGauges />
                      <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center p-2">
                              <p className="text-[#005DE9] text-md font-bold">
                                  Companies{" "}
                                  <span className="bg-slate-200 text-sm  px-2 text-[#005DE9] rounded-3xl font-medium ">
                                      {companyApplicants}
                                  </span>
                              </p>
                          </div>
                          <div className="flex items-center p-2">
                              <p className="text-[#65E500] text-md">
                                  Schools{" "}
                                  <span className="bg-slate-200 text-[#65E500] text-sm font-medium px-2 rounded-3xl">
                                      {schoolApplicants}
                                  </span>
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <p className="my-3">Overview</p>
          <div className="flex items-center gap-2">
              <div className="w-3/5 bg-white rounded-2xl shadow p-3">
                  <div className="flex justify-between">
                      <p className="text-xl font-medium">
                          SDF Graduates Per Year
                      </p>
                      <div className="rounded-full border-black-1">
                          <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                              <option value="select-level">construction</option>
                          </select>
                      </div>
                  </div>

                  <DashboardLineChart data={transformedData} />
              </div>

              <div className="w-2/5 bg-white rounded-2xl shadow p-3">
                  <div className="flex justify-end ">
                      <div className="rounded-full border-black-1">
                          <select className="p-2 border border-1 border-gray-400  text-gray-400 rounded-full text-md">
                              <option value="select-level">evaluation</option>
                          </select>
                      </div>
                  </div>
                  <div className="my-5">
                      <ProgressGender
                          boysCount={boysCount}
                          girlsCount={girlsCount}
                          totalCount={totalCount}
                          startDate={startDate}
                          endDate={endDate}
                      />
                  </div>
              </div>
          </div>
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
                  <div className="flex justify-between  items-center">
                      <div className="text-md">
                          <p>Number of submission</p>
                      </div>

                      <div className="text-xl">
                          <AdminAction call={null} setIsCall={() => {}} />{" "}
                      </div>

                      {/* Adding AdminAction component */}
                  </div>
                  <Dash
                      col1="Number of Applications "
                      col2="Number of Applicants"
                      data={applicantData}
                  />
              </div>
              <div className="bg-white p-6 rounded-2sm">
                  <div className="flex justify-between items-center">
                      <div className="text-md">
                          <p>Applications</p>
                      </div>

                      <div className="text-md gap-4 flex items-center justify-center">
                          <div className="rounded-full bg-slate-400 bg-opacity-10">
                              <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                                  <span className="text-gray-400">
                                      <SolarBenzeneRingBroken />
                                  </span>
                                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                                      <option value="select-stage">
                                          select stage
                                      </option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <AdminAction call={null} setIsCall={() => {}} />
                          </div>
                      </div>
                  </div>

                  {/* Dash component */}
                  <Dash
                      col1="Approved Applications"
                      col2="Rejected Applications"
                      data={applicantData}
                  />
              </div>
              <div className="bg-white p-6 rounded-2xl">
                  <div className="flex justify-between  items-center">
                      <div className="text-md">
                          <p>Applicants</p>
                      </div>

                      <div className="text-md gap-4 flex items-center justify-center">
                          <div className="rounded-full bg-slate-400 bg-opacity-10">
                              <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                                  <span className="text-gray-400">
                                      <SolarBenzeneRingBroken />
                                  </span>
                                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                                      <option value="select-stage">
                                          select stage
                                      </option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <AdminAction call={null} setIsCall={() => {}} />{" "}
                          </div>
                      </div>

                      {/* Adding AdminAction component */}
                  </div>
                  <Dash
                      col1="Approved Applications "
                      col2="Rejected Applicants"
                      data={applicantData}
                  />
              </div>
              <div className="bg-white p-6 rounded-2xl">
                  <div className="flex justify-between  items-center">
                      <div className="text-md">
                          <p>Selected Trainees</p>
                      </div>
                      <div className="text-md gap-4 flex items-center justify-center">
                          <div className="rounded-full bg-slate-400 bg-opacity-10">
                              <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                                  <span className="text-gray-400">
                                      <SolarBenzeneRingBroken />
                                  </span>
                                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                                      <option value="select-stage">
                                          select stage
                                      </option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <AdminAction call={null} setIsCall={() => {}} />{" "}
                          </div>
                      </div>

                      {/* Adding AdminAction component */}
                  </div>
                  <Dash col1="Male" col2="Female" data={applicantData} />
              </div>
              <div className="bg-white p-6 rounded-2xl">
                  <div className="flex justify-between">
                      <div className="text-md  items-center">
                          <p>Number of graduates trainees before 2025</p>
                      </div>

                      <div className="text-md gap-4 flex items-center justify-center">
                          <div>
                              <AdminAction call={null} setIsCall={() => {}} />{" "}
                          </div>
                      </div>
                      {/* Adding AdminAction component */}
                  </div>
                  <Dash col1="Male" col2="Female" data={applicantData} />
              </div>
              <div className="bg-white p-6 rounded-2xl">
                  <div className="flex justify-between  items-center">
                      <div className="text-md">
                          <p>Trainees</p>
                      </div>
                      <div className="text-md gap-4 flex items-center justify-center">
                          <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-4">
                              <span className="text-gray-400">
                                  <SolarCalendarBold />
                              </span>
                              <p>Ending date</p>
                          </div>
                          <div className="rounded-full bg-slate-400 bg-opacity-10">
                              <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                                  <span className="text-gray-400">
                                      <SolarBenzeneRingBroken />
                                  </span>
                                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                                      <option value="select-stage">
                                          select stage
                                      </option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <AdminAction call={null} setIsCall={() => {}} />{" "}
                          </div>
                      </div>

                      {/* Adding AdminAction component */}
                  </div>
                  <Dash col1="Male" col2="Female" data={applicantData} />
              </div>
          </div>
      </div>
  );
};

export default Page;
