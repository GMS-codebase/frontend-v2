import { useDisclosure } from "@mantine/hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import AddContract from "@/components/Modals/AddContract"; // Import AddContract
import AddMinute from "@/components/Modals/contracts/AddMinutes"; // Import AddMinute (for minutes)
import { VscEye } from "react-icons/vsc";
import { Upload } from "solar-icon-set";
import { useState } from "react";
import { handleDownloadFile } from "@/utils/funcs";
import MinutesNegotiateRejectionReason from "@/components/Modals/minutes/MinutesNegotiateRejectionReason";
import ViewMinutes from "@/components/Modals/minutes/ViewMinutes"; // Add this import

const MinutesActions = ({
  setIsMinute,
  data,
  status,
  minute,
}: {
  setIsMinute: (employee: any) => void;
  data: any;
  status: string;
  minute: any;
}) => {
  console.log("data --> ", data);
  const [isOpenAddMinute, { open: openMinute, close: closeMinute }] =
    useDisclosure(false);
  const [type, setType] = useState<
    "signed" | "unsigned" | "updated" | "negotiated"
  >("unsigned");
  const [
    isOpenRejectionReason,
    { open: openRejectionReason, close: closeRejectionReason },
  ] = useDisclosure(false);
  const [isOpenViewMinutes, { open: openViewMinutes, close: closeViewMinutes }] = 
    useDisclosure(false);
  return (
    <div>
      <Menu shadow="lg" width={300}>
        <Menu.Target>
          <button
            style={{
              background:
                "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="p-3 rounded-full border text-white hover:bg-red-100"
          >
            <HiDotsHorizontal size={25} color="white" />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <h1 className="text-lg">Actions</h1>
          </Menu.Label>
          <Menu.Divider />

          {status === "ready" && (
            <Menu.Item
              onClick={() => {
                openMinute();
                setType("unsigned");
              }}
              className="w-full py-1 text-[#576074]"
            >
              <div className="flex items-center gap-3 py-1">
                <Upload size={21} />
                <span>Upload contract negotiation</span>
              </div>
            </Menu.Item>
          )}

          {status === "uploaded" && (
            <>
              {/* <Menu.Item
                onClick={openViewMinutes}
                className="w-full py-1 text-[#576074]"
              >
                <div className="flex items-center gap-3 py-1">
                  <VscEye size={21} />
                  <span>View</span>
                </div>
              </Menu.Item> */}
              <Menu.Item
                onClick={() => {
                  openMinute(), setType("updated");
                }}
                className="w-full py-1 text-[#576074]"
              >
                <div className="flex items-center gap-3 py-1">
                  <CiEdit size={21} />
                  <span>Update</span>
                </div>
              </Menu.Item>
            </>
          )}

          {status === "approved" && (
            <>
              {/* <Menu.Item
                onClick={() => setIsMinute(data)}
                className="w-full py-1 text-[#576074]"
              >
                <div
                  onClick={() =>
                    handleDownloadFile(
                      data?.attachment,
                      "negotiations-contract",
                    )
                  }
                  className="flex items-center gap-3 py-1"
                >
                  <VscEye size={21} />
                  <span>View</span>
                </div>
              </Menu.Item> */}
              <Menu.Item
                onClick={() => {
                  openMinute();
                  setType("signed");
                }}
                className="w-full py-1 text-[#576074]"
              >
                <div className="flex items-center gap-3 py-1">
                  <Upload size={21} />
                  <span>Upload Signed Meeting Minutes</span>
                </div>
              </Menu.Item>
            </>
          )}

          {status === "rejected" && (
            <Menu.Item
              onClick={() => {
                openRejectionReason();
                setIsMinute(data);
              }}
              className="w-full py-1 text-[#576074]"
            >
              <div className="flex items-center gap-3 py-1">
                <VscEye size={21} />
                <span>View reason and respond</span>
              </div>
            </Menu.Item>
          )}

          {status === "negotiated" && (
            <>
              <Menu.Item
                onClick={() => {
                  openRejectionReason();
                  setIsMinute(data);
                }}
                className="w-full py-1 text-[#576074]"
              >
                <div className="flex items-center gap-3 py-1">
                  <VscEye size={21} />
                  <span>View reason and respond</span>
                </div>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  openMinute();
                  setType("negotiated");
                }}
                className="w-full py-1 text-[#576074]"
              >
                <div className="flex items-center gap-3 py-1">
                  <VscEye size={21} />
                  <span>Upload another contract negotiation</span>
                </div>
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
      <AddMinute
        type={type}
        data={data}
        isOpenAddMinute={isOpenAddMinute}
        closeAddMinute={closeMinute}
      />
      <MinutesNegotiateRejectionReason
        decision={data?.minutes?.[0]?.decision}
        isOpen={isOpenRejectionReason}
        onClose={closeRejectionReason}
        minute={data}
        type={status}
      />
      {/* <ViewMinutes
        isOpen={isOpenViewMinutes}
        onClose={closeViewMinutes}
        minute={data}
        decision={data?.minutes?.[0]?.decision}
        type={status}
      /> */}
    </div>
  );
};

export default MinutesActions;
