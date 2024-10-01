"use client";
import React from "react";
import CustomBarChart from "@/components/core/charts/CustomBarChart";
import { SolarCalendarBold } from "@/components/core/icons";
import { Select } from "@mantine/core"; // Importing Mantine's Select component for better styling
import dashVector from "@/assets/Vectors/dashVector.png";
import DashboardLineChart from "@/components/core/charts/DashboardLineChart";
import Image from "next/image";
import ProgressGender from "./progressGender";
import BasicGauges from "./BasicGauges"; // Import your BasicGauges component

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
      borderColor: "#FF5722", // Orange color for border
      backgroundColor: "#FF5722", // Orange color for fill
      fill: true,
    },
  ],
};

// Debugging to check if the correct data is being passed to the chart
console.log("Transformed Data for Line Chart:", transformedData);

const Page = () => {
  const boysCount = 20; // Replace with dynamic data
  const girlsCount = 15; // Replace with dynamic data
  const totalCount = boysCount + girlsCount; // Calculate total

  const startDate = "2023-05-01"; // Replace with dynamic data
  const endDate = "2023-12-31"; // Replace with dynamic data

  const companyApplicants = 12345; // Replace with dynamic data
  const schoolApplicants = 11123; // Replace with dynamic data
  const totalApplicants = companyApplicants + schoolApplicants; // Total applications

  return (
      <div className="w-full text-secondaryText pb-20 overflow-y-auto">
          <div className="flex flex-col mb-4">
              <div className="flex justify-between">
                  <p>Evaluation</p>
                  <div className="bg-[] text-[]">
                      <Select
                          placeholder="select call"
                          data={[
                              "SDF CALL 5 FOR GRANT PROPOSALS",
                              "SDF CALL 3 FOR GRANT PROPOSALS",
                              "SDF CALL 2 FOR GRANT PROPOSALS",
                              "SDF CALL 7 FOR GRANT PROPOSALS",
                              "SDF CALL 8 FOR GRANT PROPOSALS",
                          ]}
                      />
                  </div>
              </div>
          </div>

          {/* Grid layout for the main section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Applicants per Priority Sector */}
              <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-lg font-semibold mb-4">
                      Applicants per Priority Sector
                  </h2>
                  {/* Sector List */}
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

              {/* SDF Graduates per Year */}
              <div className="bg-white p-6 rounded-2xl relative">
                  <div className="flex justify-between items-center mb-8">
                      <p className="text-xl font-medium">
                          SDF Graduates Per Year
                      </p>
                      <Select
                          placeholder="Select Stage"
                          data={[
                              "Evaluation",
                              "Duediligency",
                              "GrantCommittee",
                              "Contract-signing",
                          ]}
                      />
                  </div>
                  <p className="text-primary text-7xl font-extrabold">13’032</p>
                  <Image
                      src={dashVector}
                      alt="dash vector"
                      className="absolute right-0 bottom-0 rounded-b-2xl"
                  />
              </div>

              {/* Total Applications */}
              <div className="bg-white p-6 rounded-2xl">
                  <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-8">
                          Total Applications
                      </h2>
                      <Select
                          placeholder="Filter by"
                          data={["All", "Manufacturing"]}
                      />
                  </div>
                  <div className="flex flex-col gap-3">
                      {/* Add Gauge chart components for Companies and Schools */}
                      <BasicGauges />

                      <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center p-2">
                              <p className="text-[#005DE9] font-bold">
                                  Companies{" "}
                                  <span className="bg-slate-400 px-2 text-black rounded font-medium">
                                      {companyApplicants}
                                  </span>
                              </p>
                          </div>
                          <div className="flex items-center p-2">
                              <p className="text-[#65E500]">
                                  Schools{" "}
                                  <span className="bg-slate-400  text-black font-medium px-2 rounded">
                                      {schoolApplicants}
                                  </span>
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Overview Section */}
          <p className="my-3">Overview</p>
          <div className="flex items-center gap-2">
              {/* Left: Line Chart */}
              <div className="w-3/5 bg-white rounded-2xl shadow p-3">
                  <div className="flex justify-between">
                      <p className="text-xl font-medium">
                          SDF Graduates Per Year
                      </p>
                      <Select
                          placeholder="Filter by"
                          data={["construction", "Manufacturing"]}
                      />
                  </div>
                  <div className="flex space-x-4 mb-4">
                      <div className="flex items-center">
                          <div className="w-4 h-4 bg-[#005DE9] rounded-3xl"></div>
                          <span className="ml-2">Completed</span>
                      </div>
                      <div className="flex items-center">
                          <div className="w-4 h-4 bg-[#FF5722] rounded-3xl"></div>
                          <span className="ml-2">Ongoing</span>
                      </div>
                  </div>
                  <DashboardLineChart data={transformedData} />
              </div>

              {/* Right: Gender Progress Section */}
              <div className="w-2/5 bg-white rounded-2xl shadow p-3">
                  <div className="flex justify-between">
                      <p className="text-xl font-medium">Gender Progress</p>
                      <Select
                          placeholder="Select Level"
                          data={[
                              "Level",
                              "Evaluation",
                              "Duediligency",
                              "GrantCommittee",
                              "Contract-signing",
                          ]}
                      />
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
      </div>
  );
};

export default Page;
