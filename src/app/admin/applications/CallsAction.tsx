import { useDisclosure } from "@mantine/hooks";
``;
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Button, Text, rem } from "@mantine/core";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";

const CallsActions = () => {
  return (
    <div>
      <Menu shadow="lg" width={200}>
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
            <Link
              href={"/admin/applications/application"}
              className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
            >
              <VscEye size={21} color="#576074" />
              View
            </Link>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default CallsActions;
