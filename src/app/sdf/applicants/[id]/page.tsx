"use client";
import React from "react";
import ContractInfo from "@/components/ApplicantInfo/ContractInfo";
import ApplicationInfo from "@/components/ApplicantInfo/ApplicationInfo";
import TraineeTable from "@/components/ApplicantInfo/TraineeTable";

const Page = () => {
  return (
    <div className="">
      <div className="flex">
        <ContractInfo />
        <ApplicationInfo />
      </div>
      <TraineeTable />
    </div>
  );
};

export default Page;
