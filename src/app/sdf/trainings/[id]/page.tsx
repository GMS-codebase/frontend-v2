"use client";

import SingleTrainingContainer from "@/components/pages/trainings/single-trainings-container";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id: trainingId } = useParams();
  return <SingleTrainingContainer trainingId={trainingId as string} />;
};

export default Page;
