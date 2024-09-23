import { Modal, Select, Text } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";
import deleteSvg from "@/assets/Vectors/delete.svg";
import { useState } from "react";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  position: string;
  isInternal: undefined | boolean;
};
const RemoveFromStage = ({
  employee,
  isOpen,
  stage,
  closeModal,
  onRemoveSector,
}: {
  employee: any;
  isOpen: boolean;
  stage: any;
  closeModal: () => void;
  onRemoveSector: any;
}) => {
  const [selectedSector, setSelectedSector] = useState("");

  const handleRemove = () => {
    if (selectedSector) {
      onRemoveSector(selectedSector);
    }
  };
  const [loading, setLoading] = useState(false);
  const handleRemoveStage = ()=>{
    setLoading(true);
    authorizedApi.post("/admin/employee/remove/stage", { stage_id: stage.uuid, emp_id: employee.uuid, sector_name: selectedSector }
    )
    .then((res)=>{
      console.log(res);
      notifications.show({
        message: "Stage removed successfully",
        color: "blue",
      })
      onRemoveSector(stage,selectedSector);
      closeModal();
    })
    .catch((err)=>{
      console.log("errorrrr --> ",err);
      notifications.show({
        title: "Failed to remove from stage",
        message: err.response.data.message ?? "",
        color: "red",
      })
    })
    .finally(()=> setLoading(false))
  }
  return (
    <Modal
      size={""}
      opened={isOpen}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeModal}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1}
          alt="vector"
          className="absolute bottom-[3rem] right-[-2rem] h-32"
          width={100}
          height={50}
        />
        <Image
          src={SideVector2}
          alt="vector"
          className="absolute top-[3rem] left-[-2rem] h-32"
          width={100}
          height={50}
        />
        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <div className="w-full flex flex-col items-center">
            <Image src={deleteSvg} alt="vector" width={200} height={50} />
            <h1 className="text-2xl font-extrabold text-center">
              Are you sure you want to remove this stage from this employee?
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              This employee will be forbidden to access these permissions
            </h2>
        <p className="text-[#000F2369] text-lg font-medium text-left">Select a sector to remove:</p>
        <Select
          className="border w-full"
          placeholder="Select a sector"
          data={stage?.sectors || []}
          value={selectedSector}
          onChange={(value: any) => setSelectedSector(value)}
          radius="md"
          size="md"
        />
          </div>
          <div className="w-full flex justify-center mt-4 space-x-4 p-6">
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRemoveStage}
              className="w-full px-4 py-3 bg-[#C50D0DF2] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {loading ? "Removing . . . " : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveFromStage;
