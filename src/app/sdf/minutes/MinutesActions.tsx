  import { useDisclosure } from "@mantine/hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import AddContract from "@/components/Modals/AddContract"; // Import AddContract
import AddMinute from "@/components/Modals/contracts/AddMinutes"; // Import AddMinute (for minutes)
import { VscEye } from "react-icons/vsc";
import { Upload } from "solar-icon-set";

const MinutesActions = ({
  setIsMinute,
  data,
  status,
}: {
  setIsMinute: (employee: any) => void;
  data: any;
  status: string;
}) => {
  const [isOpenAddContract, { open: openContract, close: closeContract }] = useDisclosure(false);
  const [isOpenAddMinute, { open: openMinute, close: closeMinute }] = useDisclosure(false);

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
            <Menu.Item onClick={openMinute} className="w-full py-1 text-[#576074]">
              <div className="flex items-center gap-3 py-1">
                <Upload size={21} />
                <span>Upload Minute Negotiation</span>
              </div>
            </Menu.Item>
          )}

          {status === "uploaded" && (
            <>
              <Menu.Item onClick={() => setIsMinute(data)} className="w-full py-1 text-[#576074]">
                <div className="flex items-center gap-3 py-1">
                  <VscEye size={21} />
                  <span>View</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={openMinute} className="w-full py-1 text-[#576074]">
                <div className="flex items-center gap-3 py-1">
                  <CiEdit size={21} />
                  <span>Update</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={() => {/* Delete functionality */}} className="w-full py-1 text-red-600">
                <div className="flex items-center gap-3 py-1">
                  <RiDeleteBinLine size={21} />
                  <span>Delete</span>
                </div>
              </Menu.Item>
            </>
          )}

          {status === "approved" && (
            <>
              <Menu.Item onClick={() => setIsMinute(data)} className="w-full py-1 text-[#576074]">
                <div className="flex items-center gap-3 py-1">
                  <VscEye size={21} />
                  <span>View</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={openContract} className="w-full py-1 text-[#576074]">
                <div className="flex items-center gap-3 py-1">
                  <Upload size={21} />
                  <span>Upload Signed Meeting Minutes</span>
                </div>
              </Menu.Item>
            </>
          )}

          {status === "rejected" && (
            <Menu.Item onClick={() => setIsMinute(data)} className="w-full py-1 text-[#576074]">
              <div className="flex items-center gap-3 py-1">
                <VscEye size={21} />
                <span>View meeting minutes</span>
              </div>
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      {/* Modals for actions */}
      <AddMinute
        data={data}
        isOpenAddMinute={isOpenAddMinute}
        closeAddMinute={closeMinute}
      />
      {/* <AddContract
        data={data}
        isOpenAddContract={isOpenAddContract}
        closeAddContract={closeContract}
      /> */}
    </div>
  );
};

export default MinutesActions;
