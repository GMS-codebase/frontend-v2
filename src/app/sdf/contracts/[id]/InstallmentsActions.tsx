import { useDisclosure } from "@mantine/hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Button, Text, rem } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import MarkAsPaidOrUnpaidModal from "@/components/Modals/MarkAsPaidOrUnpaidModal";

const InstallmentsActions = ({
  data,
  contractId,
}: {
  data: any;
  contractId: string;
}) => {
  const [isOpenMarkAsPaidOrUnpaid, { open: openMarkAsPaidOrUnpaid, close: closeMarkAsPaidOrUnpaid }] =
    useDisclosure(false);
  return (
    <div className="">
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
        <Menu.Item className="bg-[#F0F0F0]">
          <div onClick={openMarkAsPaidOrUnpaid} className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
            <FiEye size={21} color="#576074" />
            Mark as {data?.paid ? "unpaid" : "paid"}
          </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <MarkAsPaidOrUnpaidModal
        isOpenModal={isOpenMarkAsPaidOrUnpaid}
        closeModal={closeMarkAsPaidOrUnpaid}
        id={data?.uuid}
        contractId={contractId}
        type={data?.paid ? "unpaid" : "paid"}
      />
    </div>
  );
};

export default InstallmentsActions;
