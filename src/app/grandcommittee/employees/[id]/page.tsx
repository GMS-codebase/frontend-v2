"use client";
import DonutChart from "@/components/chart/DonutChart";
import {
  SolarAddFolderBold,
  SolarAddSquareBold,
  SolarBookmarkBold,
  SolarCalendarBold,
  SolarPen2Bold,
  SolarShieldUserOutline,
  SolarShieldWarningBold,
  SolarTrashBinTrashOutline,
} from "@/components/core/icons";
import AssignStage from "@/components/Modals/AssignStage";
import MakeManager from "@/components/Modals/MakeManager";
import RemoveFromStage from "@/components/Modals/RemoveFromStage";
import UpdateEmployee from "@/components/Modals/UpdateEmployee";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
const assignedStages = [
  {
    name: "Evaluation",
    isManager: false,
  },
  {
    name: "DueDiligency",
    isManager: true,
  },
  {
    name: "SDFSecretariate",
    isManager: false,
  },
];

const AssignedStage = ({
  stage,
  open,
}: {
  stage: any;
  open: (prop: any) => void;
}) => {
  const {employees} = useSelector((state: any)=> state.employees);
  const employee = employees.find((employee: any) => employee.uuid === employee.uuid);
  console.log(employees);
  console.log("employee", employee);
  return (
    <div className="w-full flex justify-between items-center bg-[#000F230A] p-3 rounded-xl">
      <h1 className="font-bold text-lg">{stage.name}</h1>
      <Menu shadow="lg" width={250}>
        <Menu.Target>
          <button
            style={{
              background:
                "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="p-2 rounded-full border text-white hover:bg-red-100"
          >
            <HiDotsHorizontal size={20} color="white" />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <h1 className="text-lg text-center">Actions</h1>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Item className="bg-[#F0F0F0]">
            <button
              onClick={() =>
                open({
                  openDelete: false,
                  openMakeManager: true,
                  level: stage.name,
                })
              }
              className="w-full py-1 flex text-sm items-center gap-3 text-[#576074]"
            >
              <span className="text-lg">
                <SolarShieldUserOutline />
              </span>
              Make Manager
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() =>
                open({
                  openDelete: true,
                  openMakeManager: false,
                  level: stage.name,
                })
              }
              className="w-full py-1 flex text-sm items-center gap-3 text-[#576074]"
            >
              <span className="text-lg">
                <SolarTrashBinTrashOutline />
              </span>
              Remove Stage
            </button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
const EmployeeDetails = () => {
  const [isAssignStage, { open, close }] = useDisclosure(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpenStage, setIsOpenStage] = useState({
    openDelete: false,
    openMakeManager: false,
    level: "",
  });
  const {employees} = useSelector((state: any)=> state.employees);
  const {id: employeeId} = useParams()
  const employee = employees.filter((employee: any) => employee.uuid === employeeId);
  return (
    <div className="w-full h-full flex items-start justify-between">
      <div className="w-[60%] flex flex-col gap-6  text-black bg-white p-3 py-5 rounded-2xl">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Employee Info</div>
          <button
            onClick={() => setIsUpdate(true)}
            className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
          >
            <span>
              <SolarPen2Bold />
            </span>
            <div>Edit</div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-y-6 justify-between w-11/12 font-semibold ">
          <div className="flex items-center gap-3">
            <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <div>Name</div>
            </div>
            <h1>Ishema Hugues</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <h1>National ID</h1>
            </div>
            <h1>123456789012345</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <div>Phone</div>
            </div>
            <h1>+250 789 175 211</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <h1>Position</h1>
            </div>
            <h1>ICT & Digital Skills Specialist</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <div>Email</div>
            </div>
            <h1>huguesishema@gmail.com</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4 w-fit  py-2 rounded-full items-center justify-center">
              <h1>Is Internal</h1>
            </div>
            <h1>YES</h1>
          </div>
        </div>
        <button
          type="button"
          className="w-fit px-10 py-2 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
        >
          Deactivate
        </button>
      </div>
      <div className="w-[38%] bg-white p-3 rounded-2xl">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Assigned Stages</div>
          <button
            onClick={open}
            className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
          >
            <span className="text-lg">
              <SolarAddSquareBold />
            </span>
            <div>Assign Stage</div>
          </button>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          {assignedStages.map((stage: any, index: number) => {
            return (
              <AssignedStage open={setIsOpenStage} key={index} stage={stage} />
            );
          })}
        </div>
      </div>

      <UpdateEmployee
        isOpenUpdateEmployee={isUpdate}
        closeUpdateEmployee={() => setIsUpdate(false)}
      />
      <AssignStage employee={employee} isAssignStage={isAssignStage} closeAssignStage={close} />
      <MakeManager
        isOpenMakeManager={isOpenStage.openMakeManager}
        closeMakeManager={() =>
          setIsOpenStage({
            openDelete: false,
            openMakeManager: false,
            level: "",
          })
        }
        level={isOpenStage.level}
      />
      <RemoveFromStage
        isOpen={isOpenStage.openDelete}
        closeRemoveEmployee={() =>
          setIsOpenStage({
            openDelete: false,
            openMakeManager: false,
            level: "",
          })
        }
      />
    </div>
  );
};

export default EmployeeDetails;
