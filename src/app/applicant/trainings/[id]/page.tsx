"use client";

import { useParams } from "next/navigation";
import SingleTrainingContainer from "@/components/pages/trainings/single-trainings-container";

function page() {
  //getting the id param LB
  const { id: trainingId } = useParams();

  return <SingleTrainingContainer trainingId={trainingId as string} />;
}

export default page;
