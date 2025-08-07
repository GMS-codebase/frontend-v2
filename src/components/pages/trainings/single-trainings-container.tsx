import { PDFViewerContainer } from "@/components/PDFViewer/pdf-viewer-container";
import Button from "@/components/ui/Button";
import React, { FC } from "react";
import CompetenciesSection from "./_partials/competence-section";
import DetailsSection from "./_partials/details-section";
import Trainees from "./_partials/trainees";
import ResponseSection from "./_partials/response-section";
import PDFViewerModal from "@/components/PDFViewer";
import CertificationGrid from "./_partials/certificationGrid";

type props = {
  trainingId: string;
};

//sample pdfurl
const PDF_URL =
  "https://res.cloudinary.com/dzueixrxm/image/upload/v1754477731/certificates/nongi6ysphqgazrd0toe.pdf";

const SingleTrainingContainer: FC<props> = ({ trainingId }) => {
  return (
    <div className="container mx-auto bg-white p-6 rounded-[30px]">
      <div>
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-primaryText">
            Training manual
          </h1>
          <Button className="bg-primary text-white py-3 px-7 !rounded-full">
            Request Training
          </Button>
        </div>
        <div className="py-10 flex flex-col gap-10">
          <PDFViewerContainer pdfUrl={PDF_URL} />
          <CompetenciesSection />
          <DetailsSection />
          <Trainees />
          <CertificationGrid />
          <ResponseSection />
        </div>
      </div>
    </div>
  );
};

export default SingleTrainingContainer;
