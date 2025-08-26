"use client";

import { Download, Maximize2 } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import { handleDownloadFile, handleViewFile } from "@/services";

interface PDFViewerContainerProps {
  pdfUrl: string;
  height?: string;
}

export function PDFViewerContainer({
  pdfUrl,
  height = "h-96",
}: PDFViewerContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filename = encodeURIComponent(pdfUrl?.split("/").pop() || "");
  const fileUrl = `/files/training/${filename}`;

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50  bg-white"
    : `relative bg-white rounded-lg overflow-hidden ${height}`;

  return (
    <div className={containerClass}>
      {/* PDF Viewer */}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
        className="w-full h-full border-0 bg-white"
        style={{background: "transparent"}}
        title="PDF Viewer"
      />

      {/* Controls */}
      <div className="absolute inset-y-0 right-4 flex items-center gap-2 z-20">
        <Button
          onClick={()=>handleViewFile(pdfUrl,"training")}
          variant="secondary"
          size="sm"
          className="bg-primary hover:bg-primary/80 text-white !p-0 !px-4 !py-4 !rounded-full shadow-md absolute bottom-4 right-4"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={()=>handleDownloadFile(pdfUrl,"training")}
          className="bg-primary !text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md absolute top-4 right-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Fullscreen close button LB */}
      {isFullscreen && (
        <Button
          onClick={()=>handleViewFile(pdfUrl,"training")}
          variant="secondary"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-md z-20"
        >
          Close Fullscreen
        </Button>
      )}
    </div>
  );
}
