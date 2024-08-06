import { useDisclosure } from "@mantine/hooks";
``;
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Button, Text, rem } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";

const EmployeeActions = ({
  employee,
  setIsEmployee,
}: {
  setIsEmployee: (employee: any) => void;
  employee: any;
}) => {
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
            <Link
              href={"/admin/employees/employee"}
              className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
            >
              <FiEye size={21} color="#576074" />
              View
            </Link>
          </Menu.Item>
          <Menu.Item>
            <div
              onClick={() =>
                setIsEmployee({
                  openUpdate: true,
                  openDelete: false,
                  employee: employee,
                })
              }
              className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
            >
              <CiEdit size={21} color="#576074" />
              Edit
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              onClick={() =>
                setIsEmployee({
                  openDelete: true,
                  openUpdate: false,
                  employee: employee,
                })
              }
              className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
            >
              <RiDeleteBinLine size={21} color="#576074" />
              Remove
            </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default EmployeeActions;
