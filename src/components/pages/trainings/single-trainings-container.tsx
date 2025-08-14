"use client";

import { PDFViewerContainer } from "@/components/PDFViewer/pdf-viewer-container";
import Button from "@/components/ui/Button";
import { ITraining } from "@/types/trainings";
import { authorizedApi } from "@/utils/api";
import { Loader2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import CertificationGrid from "./_partials/certificationGrid";
import CompetenciesSection from "./_partials/competence-section";
import DetailsSection from "./_partials/details-section";
import ResponseSection from "./_partials/response-section";
import Trainees from "./_partials/trainees";
import { usePathname } from "next/navigation";
import {
  getTrainingById,
  requestTrainingReview,
  sdfMakeTrainingDecision,
} from "@/services";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

type props = {
  trainingId: string;
};

const SingleTrainingContainer: FC<props> = ({ trainingId }) => {
  const dispatch = useDispatch();

  const {
    currentTraining: training,
    loading,
    requestReviewLoading,
  } = useSelector((state: any) => state.trainings);

  const [selectedRequest, setSelectedRequest] = useState("");
  const responseRef = React.useRef<HTMLDivElement | null>(null);
  const active = usePathname();

  const [currentRole, setCurrentRole] = useState<string | null>(null);

  // Get current user role
  useEffect(() => {
    const role = active.startsWith("/admin")
      ? "ADMIN"
      : active.startsWith("/applicant")
        ? "APPLICANT"
        : active.startsWith("/sdf")
          ? "SDF_SECRETARIATE"
          : null;

    setCurrentRole(role);
  }, [active]);

  useEffect(() => {
    dispatch(getTrainingById(trainingId) as any);
  }, [dispatch]);

  //handle request training review by sdf
  const handleReviewRequest = () => {
    dispatch(requestTrainingReview(trainingId) as any);
  };

  const handleAddTraineeRequest = () => {
    setSelectedRequest("ADD");
    responseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMakeDecision = () => {
    setSelectedRequest("APPROVE_TRAINING");
    responseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin" fontSize={32} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white p-6 rounded-[30px]">
      <div>
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-primaryText">
            Training manual
          </h1>
          {currentRole === "APPLICANT" && training?.status === "DRAFT" ? (
            <Button
              onClick={handleReviewRequest}
              className="bg-primary text-white py-3 px-7 !rounded-full"
            >
              {requestReviewLoading ? <Loader2 /> : "Request Training"}
            </Button>
          ) : training.status === "REVIEW" &&
            currentRole === "SDF_SECRETARIATE" ? (
            <Button
              onClick={handleMakeDecision}
              className="bg-primary text-white py-3 px-7 !rounded-full"
            >
              {"Make Decision"}
            </Button>
          ) : null}
        </div>
        <div className="py-10 flex flex-col gap-10">
          <PDFViewerContainer pdfUrl={training?.trainingManual as string} />
          <CompetenciesSection
            competencies={
              training?.competencies
                ? JSON.parse(training?.competencies.join(",") as string)
                : []
            }
          />
          <DetailsSection training={training} />
          <Trainees
            trainees={training?.trainees ?? []}
            handleAddTraineeRequest={handleAddTraineeRequest}
            currentRole={currentRole}
          />
          <CertificationGrid currentRole={currentRole} />
          <div ref={responseRef}>
            <ResponseSection
              training={training}
              selectedRequest={selectedRequest}
              setSelectedRequest={setSelectedRequest}
              currentRole={currentRole as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTrainingContainer;
