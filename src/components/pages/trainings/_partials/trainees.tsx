import { PDFViewerContainer } from "@/components/PDFViewer/pdf-viewer-container";
import React, { FC } from "react";

type props = {
  pdf_url: string;
};
const Trainees: FC<props> = ({ pdf_url }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Trainees
      </h2>
      <div>
        <PDFViewerContainer pdfUrl={pdf_url} />
      </div>
    </div>
  );
};

export default Trainees;
