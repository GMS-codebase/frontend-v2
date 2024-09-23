import { useDisclosure } from "@mantine/hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import AddContract from "@/components/Modals/AddContract"; // Import AddContract
import AddMinute from "@/components/Modals/contracts/AddMinutes"; // Import AddMinute (for minutes)

const MinutesActions = ({
  setIsMinute,
  data,
  isNew,
}: {
  setIsMinute: (employee: any) => void;
  data: any;
  isNew?: boolean;
}) => {
  const [isOpenAddContract, { open: openContract, close: closeContract }] =
    useDisclosure(false);
  const [isOpenAddMinute, { open: openMinute, close: closeMinute }] =
    useDisclosure(false); // Control AddMinute modal

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
          {isNew && (
            <Menu.Item>
              <div
                onClick={openMinute} // Open AddMinute modal when clicked
                className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                <CiEdit size={21} color="#576074" />
                Upload Minute Negotiation
              </div>
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      {/* AddMinute modal for uploading the minute negotiation */}
      <AddMinute
        data={data}
        isOpenAddMinute={isOpenAddMinute} // Pass modal open state
        closeAddMinute={closeMinute} // Pass the function to close modal
      />
    </div>
  );
};

export default MinutesActions;
