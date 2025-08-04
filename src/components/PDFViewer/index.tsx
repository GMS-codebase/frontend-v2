import { Modal } from "@mantine/core";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewerModal = ({
  pdfPath,
  closeViewPDF,
  isOpenViewPDF,
}: {
  pdfPath: string | null;
  closeViewPDF: () => void;
  isOpenViewPDF: boolean;
}) => {
  return (
    <Modal opened={isOpenViewPDF} onClose={closeViewPDF} size="xl" centered>
      {pdfPath ? (
        <div style={{ height: "70vh", overflow: "auto" }}>
          <Document file={pdfPath}>
            <Page pageNumber={1} width={800} />
          </Document>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600">
          No PDF document found
        </div>
      )}
    </Modal>
  );
};

export default PDFViewerModal;
