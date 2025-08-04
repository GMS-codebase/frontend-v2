"use client";
import React from "react";
import CustomBarChart from "@/components/core/charts/CustomBarChart";
import { SolarCalendarBold } from "@/components/core/icons";
import { Select } from "@mantine/core";
import dashVector from "@/assets/Vectors/dashVector.png";
import DashboardLineChart from "@/components/core/charts/DashboardLineChart"; // Import the line chart component
import Image from "next/image";

const weeklyData = [
  { day: "Mon", completed: 50, ongoing: 20 },
  { day: "Tue", completed: 75, ongoing: 15 },
  { day: "Wed", completed: 100, ongoing: 25 },
  { day: "Thu", completed: 60, ongoing: 10 },
  { day: "Fri", completed: 90, ongoing: 30 },
  { day: "Sat", completed: 40, ongoing: 5 },
  { day: "Sun", completed: 30, ongoing: 10 },
];

const lineChartData = {
  labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023"],
  datasets: [
    {
      label: "Graduates",
      data: [110, 50, 80, 200, 50, 30, 350],
      borderColor: "#005DE9",
      backgroundColor: "#005DE9",
      fill: true,
    },
  ],
};

const Page = () => {
  return (
    <div className="w-full text-secondaryText pb-20 overflow-y-auto">
      <div className="flex items-center justify-between">
        <p>Evaluation</p>
        <button className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
          <h1 className="text-base font-medium text-white">Today</h1>
          <span className="text-2xl">
            <SolarCalendarBold />
          </span>
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">
            Applicants per Priority Sector
          </h2>
          <div className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl  text-primary">
            <span className="text-base">Culinary Programs</span>
            <span className="text-base  bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
              32
            </span>
          </div>
          <div className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl  text-primary mt-2">
            <span className="text-base">Tech Innovators</span>
            <span className="text-base  bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
              14
            </span>
          </div>
          <div className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl  text-primary mt-2">
            <span className="text-base">Masonry Internships</span>
            <span className="text-base  bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
              20
            </span>
          </div>
          <div className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl  text-primary mt-2">
            <span className="text-base">Culinary Workshops</span>
            <span className="text-base  bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
              8
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl relative">
          <h2 className="text-lg font-semibold mb-8">Selected Applications</h2>
          <p className="text-primary text-7xl font-extrabold">13’032</p>
          <Image
            src={dashVector}
            alt=""
            className="absolute right-0 bottom-0 rounded-b-2xl"
          />
        </div>
        <div className="bg-white p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-8">Total Applications</h2>
          <div className="flex items-center gap-3">
            <p className="text-primary text-8xl font-extrabold">23k</p>
            <div className="text-primary text-sm space-y-2">
              <p>
                Companies{" "}
                <span className="bg-[#005DE91F] px-2  rounded font-medium">
                  12345
                </span>
              </p>
              <p>
                Schools{" "}
                <span className="bg-[#005DE91F] px-2  rounded font-medium">
                  11123
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="my-3">Overview</p>
      <div className="flex items-center gap-2">
        <div className="w-3/5 bg-white rounded-2xl shadow p-3">
          <p className="text-xl font-medium">SDP Graduates Per year</p>
          {/* Insert the DashboardLineChart component here */}
          <DashboardLineChart data={lineChartData} />
        </div>
        <div className="w-2/5 bg-white rounded-2xl shadow p-3">
          <div className="flex items-center justify-between">
            <p>Applicants rate analysis</p>
            <Select
              name="time"
              value={"this-week"}
              data={[
                { value: "this-week", label: "This Week" },
                { value: "last-week", label: "Last Week" },
              ]}
              placeholder="Select time"
              required
              className="border rounded-full shadow-sm focus:outline-none px-2"
            />
          </div>
          <div className="my-5">
            {/* <CustomBarChart data={weeklyData} maxValue={100} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
