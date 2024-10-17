import { useDisclosure } from "@mantine/hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Button, Text, rem } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { SolarFileBold } from "../core/icons";

const AdminAction = ({
  call,
  setIsCall,
}: {
  setIsCall: (employee: any) => void;
  call: any;
}) => {
  return (
    <div className="">
      <Menu shadow="xs" width={300}>
        <Menu.Target>
          <button
            style={{
              background:
                "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
              padding: "0.4rem", // Adjusted padding
            }}
            className="rounded-full border text-white hover:bg-red-100"
          >
            <HiDotsHorizontal size={18} color="white" />{" "}
            {/* Reduced icon size */}
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <h1 className="text-lg">Actions</h1>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Item className="bg-[#F0F0F0]">
            <Link
              href={`/admin/calls/${call?.uuid}`}
              className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
            >
              <SolarFileBold />
              Export as excel
            </Link>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default AdminAction;
