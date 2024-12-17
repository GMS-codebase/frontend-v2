import { Modal } from "@mantine/core";
import PDFViewer from "pdf-viewer-reactjs";

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
        <div style={{ height: "70vh" }}>
          <PDFViewer
            document={{
              url: pdfPath,
            }}
            hideNavbar
            css="customViewer"
          />
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
