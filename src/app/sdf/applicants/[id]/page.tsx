"use client";
import React, { useState } from "react";
import ContractInfo from "@/components/ApplicantInfo/ContractInfo";
import ApplicationInfo from "@/components/ApplicantInfo/ApplicationInfo";
import TraineeTable from "@/components/ApplicantInfo/TraineeTable";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

const Page = () => {
  const { id: applicationId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { myContracts: contracts, loading } = useSelector(
    (state: any) => state.contracts,
  );
  const { myApplications: applications, loading: loadingApplications } =
    useSelector((state: any) => state.applications);
  const application = applications.find(
    (a: any) => a.uuid === applicationId,
  ) ?? [0];
  const contract = contracts.find(
    (c: any) => c.application_ID === applicationId,
  ) ?? [0];
  return (
    <div className="">
      <div className="flex gap-2">
        <ContractInfo contract={contract} />
        <ApplicationInfo application={application} />
      </div>
      <TraineeTable
        installments={contract?.installments ?? []}
        trainees={contract?.trainees ?? []}
      />
    </div>
  );
};

export default Page;
