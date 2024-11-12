"use client";
import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useParams } from "next/navigation";
import { unauthorizedApi } from "@/utils/api";
import "@react-pdf-viewer/core/lib/styles/index.css";
import * as Pdfjs from "pdfjs-dist";
Pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${Pdfjs.version}/build/pdf.worker.min.mjs`;
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Initialize the default layout plugin
// const defaultLayoutPluginInstance = defaultLayoutPlugin();

// Reusable download function based on your provided logic
const handleDownloadFile = async (
  service: string,
  filename: string,
): Promise<Blob | null> => {
  try {
    const response = await unauthorizedApi.get(
      `/admin/download/${service}/${encodeURIComponent(filename)}`,
      {
        responseType: "blob",
      },
    );
    return new Blob([response.data], {
      type: response.headers["content-type"],
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileBlobUrl, setFileBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const [service, file] = id;
    const decodedFile = decodeURIComponent(file);
    const extension = decodedFile?.split(".").pop()?.toLowerCase() || "";

    if (service && decodedFile) {
      setFileType(extension);
      displayFile(service, decodedFile, extension);
    }

    // Cleanup blob URL when component unmounts
    return () => {
      if (fileBlobUrl) {
        URL.revokeObjectURL(fileBlobUrl);
        setFileBlobUrl(null);
      }
    };
  }, [id]);

  const displayFile = async (
    service: string,
    file: string,
    extension: string,
  ) => {
    const blob = await handleDownloadFile(service, file);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      setFileBlobUrl(blobUrl);

      if (extension === "docx") {
        renderDocx(blob);
      }
    }
  };

  const renderDocx = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const { value } = await mammoth.convertToHtml({ arrayBuffer });
    setHtmlContent(value);
  };



  return (
    <div>
      {fileType === "pdf" && fileBlobUrl && <Viewer fileUrl={fileBlobUrl} />}
      {fileType === "docx" && (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
      {fileType === "doc" && (
        <p>
          Unsupported file type: Please convert .doc files to .pdf or .docx.
        </p>
      )}
    </div>
  );
};

export default Page;
