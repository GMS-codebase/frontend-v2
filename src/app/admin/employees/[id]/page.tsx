"use client";
import {
  SolarAddSquareBold,
  SolarPen2Bold,
  SolarShieldUserOutline,
  SolarTrashBinTrashOutline,
} from "@/components/core/icons";
import AssignStage from "@/components/Modals/AssignStage";
import MakeManager from "@/components/Modals/MakeManager";
import RemoveFromStage from "@/components/Modals/RemoveFromStage";
import UpdateEmployee from "@/components/Modals/UpdateEmployee";
import SelectSectorModal from "@/components/Modals/SelectSectorModal";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";

// Function to group stages by stage name and collect sectors
const groupStages = (stages: any) => {
  return stages.reduce((acc: any, curr: any) => {
    const existingStage = acc.find((item: any) => item.stage === curr.stage);
    if (existingStage) {
      existingStage.sectors.push(curr.sector);
    } else {
      acc.push({
        stage: curr.stage,
        sectors: [curr.sector],
        ...curr,
      });
    }
    return acc;
  }, []);
};

// Component to render each assigned stage
const AssignedStage = ({
  stage,
  open,
  onRemoveClick,
}: {
  stage: any;
  open: any;
  onRemoveClick: any;
}) => {
  return (
    <div className="w-full flex justify-between items-center bg-[#000F230A] p-3 rounded-xl">
      <div>
        <h1 className="font-bold text-lg">{stage.stage}</h1>
        <p className="text-sm text-gray-500">
          Sectors: {stage.sectors.join(", ")}
        </p>
      </div>
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
                  level: stage?.name,
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
              onClick={() => onRemoveClick(stage)}
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

// Main component for employee details
const EmployeeDetails = () => {
  const [isAssignStage, { open, close }] = useDisclosure(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpenStage, setIsOpenStage] = useState({
    openDelete: false,
    openMakeManager: false,
    level: "",
  });

  const [isSelectSectorOpen, setIsSelectSectorOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const { employees } = useSelector((state: any) => state.employees);
  const { id: employeeId } = useParams();
  const employee = employees.filter(
    (employee: any) => employee.uuid === employeeId,
  );
  const [employeeStages, setEmployeesStages] = useState(
    employee[0]?.emp_stages,
  );

  // Group the employee stages
  const groupedStages = groupStages(employee[0]?.emp_stages || []);

  // Handle clicking on remove stage
  const handleRemoveClick = (stage: any) => {
    if (!stage || !stage.sectors || stage.sectors.length === 0) {
      console.error("Invalid stage data");
      return;
    }
    setSelectedStage(stage);
    setIsSelectSectorOpen(true);
  };

  //   const handleRemoveSector = (stage: any, sector: any) => {
  //     const updatedStages = employeeStages.emp_stages.filter(
  //       (s: any) => !(s.stage === stage.stage && s.sector === sector),
  //     );
  //     setEmployeesStages({
  //       ...employeeStages,
  //       emp_stages: updatedStages,
  //     });
  //     setIsSelectSectorOpen(false);
  //     close();
  // };

  return (
    <div className="w-full h-full flex items-start justify-between">
      {/* Employee Info Section */}
      <div className="w-[60%] flex flex-col gap-6 text-black bg-white p-3 py-5 rounded-2xl">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Employee Info</div>
          <button
            onClick={() => setIsUpdate(true)}
            className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center"
          >
            <span>
              <SolarPen2Bold />
            </span>
            <div>Edit</div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-y-6 justify-between Apw-11/12 font-semibold">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <div>Name</div>
            </div>
            <h1>{employee[0]?.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <h1>National ID</h1>
            </div>
            <h1>{employee[0]?.nationalId}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <div>Phone</div>
            </div>
            <h1>{employee[0]?.phone}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <h1>Position</h1>
            </div>
            <h1>{employee[0]?.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <div>Email</div>
            </div>
            <h1>{employee[0]?.email}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 w-fit py-2 rounded-full items-center justify-center">
              <h1>Is Internal</h1>
            </div>
            <h1>{employee[0]?.is_internal ? "YES" : "NO"}</h1>
          </div>
        </div>
        <button
          type="button"
          className="w-fit px-10 py-2 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
        >
          Deactivate
        </button>
      </div>

      {/* Assigned Stages Section */}
      <div className="w-[38%] bg-white p-3 rounded-2xl">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Assigned Stages</div>
          <button
            onClick={open}
            className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center"
          >
            <span className="text-lg">
              <SolarAddSquareBold />
            </span>
            <div>Assign Stage</div>
          </button>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          {groupedStages.map((stage: any, index: any) => (
            <AssignedStage
              open={setIsOpenStage}
              key={index}
              stage={stage}
              onRemoveClick={handleRemoveClick}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <UpdateEmployee
        isOpenUpdateEmployee={isUpdate}
        closeUpdateEmployee={() => setIsUpdate(false)}
      />
      <AssignStage
        employee={employee}
        isAssignStage={isAssignStage}
        closeAssignStage={close}
      />
      <MakeManager
        employee={employee}
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
        isOpen={isSelectSectorOpen}
        // onRemoveSector={handleRemoveSector}
        stage={selectedStage}
        closeModal={() => setIsSelectSectorOpen(false)}
        employee={employee[0]}
      />
    </div>
  );
};

export default EmployeeDetails;
