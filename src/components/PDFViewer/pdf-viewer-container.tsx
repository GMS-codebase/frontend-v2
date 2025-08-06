"use client";

import { useState } from "react";
import { Download, ExternalLink, Maximize2 } from "lucide-react";
import Button from "../ui/Button";

interface PDFViewerContainerProps {
  pdfUrl: string;
  height?: string;
}

export function PDFViewerContainer({
  pdfUrl,
  height = "h-96",
}: PDFViewerContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "training-manual.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };


  const containerClass = isFullscreen
    ? "fixed inset-0 z-50  bg-white"
    : `relative bg-white rounded-lg overflow-hidden ${height}`;

  return (
    <div className={containerClass}>
      {/* PDF Viewer */}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
        className="w-full h-full border-0 bg-white"
        style={{background: "transparent"}}
        title="PDF Viewer"
      />

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
        <Button
          onClick={toggleFullscreen}
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-primary !text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Fullscreen close button LB */}
      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          variant="secondary"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-md z-20"
        >
          Close Fullscreen
        </Button>
      )}
    </div>
  );
}
