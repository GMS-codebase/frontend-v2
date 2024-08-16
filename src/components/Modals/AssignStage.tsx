import { Checkbox, Modal, MultiSelect, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import {
  PhGenderIntersex,
  SolarSuitcaseLinear,
  SolarUserCircleOutline,
} from "../core/icons";
import { authorizedApi } from "@/utils/api";
import { ClipLoader } from "react-spinners";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  position: string;
  isInternal: undefined | boolean;
};
const AssignStage = ({
  employee,
  isAssignStage,
  closeAssignStage,
}: {
  employee: any;
  isAssignStage: boolean;
  closeAssignStage: () => void;
}) => {
  console.log("employee in assign stage", employee);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    position: "",
    isInternal: undefined,
  });
  const [stage, setStage] = useState("");
  const [sectorId, setSectorId] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const {sectors} = useSelector((state: any)=> state.sectors);
  const MultiSelectSectors = sectors.map((sector: any)=> {
    return {value: sector.uuid, label: sector.name};
  })
  const handleSubmit = (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();
    authorizedApi.post("/admin/employee/assign/stage", {
      emp_id: employee[0]?.uuid,
      emp_stage: stage,
      sectorIds: sectorId,
    })
    .then((res)=>{
      console.log(res.data);
      notifications.show({
        message: "Stage assigned successfully",
        color:"blue"
      })
      closeAssignStage();
    })
    .catch((err)=>{
      console.log(err.response);
      notifications.show({
        message: err.response?.data?.message,
        color:"red"
      })
    })
    .finally(()=> setLoading(false));
  };
  return (
    <Modal
      size={""}
      opened={isAssignStage}
      onClose={closeAssignStage}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAssignStage}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1}
          alt="vector"
          className="absolute top-[3rem] right-[0rem]"
          width={30}
          height={50}
        />
        <Image
          src={SideVector2}
          alt="vector"
          className="absolute bottom-[1rem] left-[-0.3rem]"
          width={30}
          height={50}
        />
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Assign stage</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Select a new role to assign to this employee
          </h2>
        </div>

        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="mt-4 w-full overflow-y-auto flex flex-col gap-2 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="position"
                className="block text-base font-medium text-black"
              >
                Select Stage
              </label>
              <div className="mt-1 pl-6 relative block w-full py-1 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-lg">
                  <SolarUserCircleOutline />
                </span>
                <Select
                  name="position"
                  value={stage}
                  onChange={(value: any) =>setStage(value)}
                  data={[
                    { value: "Evaluation", label: "Evaluation" },
                    { value: "DueDiligency", label: "DueDiligency" },
                    { value: "SDFSecretariate", label: "SDFSecretariate" },
                  ]}
                  placeholder="Select stage"
                  className="text-base"
                  required
                />
              </div>
            </div>

            <div className="w-full">
                  <label
                    htmlFor="trade"
                    className="block text-base font-medium text-black"
                  >
                    Sectors
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <MultiSelect
                      name="sectors"
                      disabled={!MultiSelectSectors}
                      onChange={setSectorId}
                      data={
                        MultiSelectSectors
                          ? MultiSelectSectors
                          : [
                              {
                                value: "NO SECTOR",
                                label: "No Sectors Created!",
                              },
                            ]
                      }
                      placeholder="Select or type in a sector"
                      required
                    />
                  </div>
                </div>

            <div className="w-full flex justify-center mt-10 space-x-4 pb-2">
              <button
                type="button"
                onClick={closeAssignStage}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? <ClipLoader color="white" size={23}/> : "Assign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AssignStage;
