import { Modal } from "@mantine/core";
import { FaGavel } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

interface ViewAppealResultsProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

const ViewAppealResultsModal = ({
  isOpen,
  onClose,
  application,
}: ViewAppealResultsProps) => {
  const { appeals } = useSelector((state: any) => state?.appeals);
  console.log(appeals, application);
  const appeal = appeals.find(
    (appeal: any) => appeal.application_number === application?.applicationNumber,
  );
  return (
    <Modal
      size=""
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full px-5 flex flex-col items-center mt-4 overflow-hidden pb-8">
          <FaGavel
            size={40}
            className={`${
              appeal?.decision === "APPROVE"
                ? "text-green-500"
                : appeal?.decision === "REJECT"
                ? "text-red-500"
                : "text-blue-500"
            } mb-4`}
          />
          <h1 className="text-2xl font-extrabold text-center">Appeal Details</h1>
          <div className="mt-6 w-full space-y-4">
            <div>
              <h2 className="text-start block text-xs font-bold text-gray-700">
                Status
              </h2>
              <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${
                appeal?.decision === 'APPROVE' ? 'bg-green-100 text-green-800' :
                appeal?.decision === 'REJECT' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
                }`}
              >
                {appeal?.decision || "PENDING"}
              </div>
            </div>

            <div>
              <h2 className="text-start block text-xs font-bold text-gray-700">
                Your Appeal
              </h2>
              <div className="mt-1 block w-full text-sm p-3 bg-[#000F230A] rounded-2xl min-h-[80px]">
                {appeal?.appeal_comment}
              </div>
            </div>

            {appeal?.decision && (
              <div>
                <h2 className="text-start block text-xs font-bold text-gray-700">
                  Response
                </h2>
                <div className="mt-1 block w-full text-sm p-3 bg-[#000F230A] rounded-2xl min-h-[60px]">
                  {appeal?.decision_comment || 'No response provided.'}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full flex justify-center mt-1 p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 px-4 py-3 bg-gray-100 text-gray-800 rounded-full shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAppealResultsModal;
