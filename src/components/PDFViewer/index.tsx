import { Modal } from "@mantine/core";
import { Document, Page } from "react-pdf";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const PDFViewerModal = ({ pdfPath, closeViewPDF, isOpenViewPDF }: { pdfPath: string; closeViewPDF: () => void; isOpenViewPDF: boolean }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  return (
    <>
      <Modal opened={isOpenViewPDF} onClose={closeViewPDF} size="xl" centered>
        {pdfPath ? (
          <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        ) : (
          <div className="text-center py-10">No attachment found</div>
        )}
      </Modal>
    </>
  );
};

export default PDFViewerModal;