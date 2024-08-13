import { Checkbox, Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import {useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import {User} from "solar-icon-set";
import {Upload} from "solar-icon-set";
import {
  CalendarMinimalistic,
  Folder2,
  ShieldWarning,
} from "solar-icon-set";

type FormData = {
  TIN: string;
  regNo: string;
  year: string;
  date: string;
  business: string;
  position: string;
  isInternal: boolean | undefined;
  email:string,
  box:string,
  phone:string,
  bank:string,
  employee:string,
  address:string,
  district:string,
  province:string,
  sector:string,
  cell:string,
  village:string,
};

const CompleteProfile = ({
  isOpenCompleteProfile,
  closeCompleteProfile,
}: {
  isOpenCompleteProfile: boolean;
  closeCompleteProfile: () => void;
}) => {

const [active, setActive] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    TIN: "",
    regNo: "",
    year: "",
    date: "",
    business: "",
    position: "",
    isInternal: undefined,
    email:"",
    box:"",
    phone:'',
    bank:"",
    employee:"",
    address:"",
    sector:"",
    cell:"",
    province:"",
    district:"",
    village:"",
  });
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data: ", formData);
  };

  const [selectedInfo, setSelectedInfo] = useState("call");
  return (
    <Modal
      size={"xl"}
      opened={isOpenCompleteProfile}
      onClose={closeCompleteProfile}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-fit relative bg-white rounded-3xl p-4 pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeCompleteProfile}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-11/12 flex justify-between items-start mt-4">
          <div className="w-[43%] flex flex-col items-start">
            <h1 className="text-2xl font-extrabold">Complete your profile</h1>
            <h2 className="text-[#000F2369] text-lg font-medium w-4/5">
                Provide the below details to complete.
            </h2>
          </div>
          <div className="w-[55%] flex items-center">
            <div
              onClick={() => setSelectedInfo("call")}
              className={`w-1/3 flex justify-end ${selectedInfo === "call" ? "bg-[#005DE90A]" : ""}`}
            >
              <button
                className={`py-2 transition-all duration-300 text-xs w-full font-medium ${selectedInfo === "call" ? "border-b-2 border-[#005DE9] text-[#005DE9]" : ""}`}
              >
                Call Details
              </button>
            </div>
            <div
              onClick={() => setSelectedInfo("timeline")}
              className={`w-1/3 flex justify-end ${selectedInfo === "timeline" ? "bg-[#005DE90A]" : ""}`}
            >
              <button
                className={`py-2 transition-all duration-200 text-xs w-full font-medium ${selectedInfo === "timeline" ? "border-b-2 border-[#005DE9] text-[#005DE9]" : ""}`}
              >
                Timeline Details
              </button>
            </div>
            <div
              onClick={() => setSelectedInfo("category")}
              className={`w-1/3 flex justify-start ${selectedInfo === "category" ? "bg-[#005DE90A]" : ""}`}
            >
              <button
                className={`py-2 transition-all duration-300 text-xs w-full  font-medium ${selectedInfo === "category" ? "border-b-2 border-[#005DE9] text-[#005DE9]" : ""}`}
              >
                Category Details
              </button>
            </div>
          </div>
        </div>

        <div className="w-11/12 flex flex-col items-center mt-4 overflow-hidden">
          {selectedInfo === "call" && (
            <form
              // onSubmit={handleSubmit}
              className="w-full overflow-y-auto flex flex-col gap-2"
            >
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="TIN"
                    className="block text-xs font-bold text-gray-700"
                  >
                    TIN
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="TIN"
                      value={formData.TIN}
                      placeholder="Call title"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="TIN"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Registration Number
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <User />
                    </span>
                    <input
                      type="number"
                      name="regNo"
                      value={formData.regNo}
                      placeholder="Registration number"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="TIN"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Year of establishment
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      placeholder="year of establishment"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="TIN"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Registration Date
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="TIN"
                      value={formData.date}
                      placeholder="Registration Date"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="TIN"
                    className="block text-xs font-bold text-gray-700"
                  >
                  Business Type
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="business"
                      value={formData.business}
                      placeholder="Type the business type"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                       <div className="w-full mt-5">
                  <label
                    htmlFor="position"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Is Internal
                  </label>
                  <div className="mt-1 pl-1 flex flex-col gap-2">
                    <Checkbox
                      label="Yes"
                      checked={formData.isInternal}
                      onChange={(e: any) =>
                        setFormData({ ...formData, isInternal: true })
                      }
                    />
                    <Checkbox
                      label="No"
                      checked={formData.isInternal == false}
                      onChange={(e: any) =>
                        setFormData({ ...formData,isInternal:false})
                      }
                    />
                  </div>
                </div>
                  </div>
                </div>
                  <div className="w-full ">
          <label
            htmlFor="fileUpload"
            className="block text-xs font-bold text-gray-700"
          >
            Attachment
          </label>
          <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <Upload className="text-[#005DE9] w-64 h-64 " />
              <div className="text-center">
                <p className="text-md text-gray-500">Upload file</p>
                <p className="text-md text-gray-400">or drag and drop</p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              className="content-none"
              required
            />
          </div>
        </div>
              </div>

           
             

              <div className="w-full flex justify-center mt-10 space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  type="button"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          {selectedInfo === "timeline" && (
           <form
              // onSubmit={handleSubmit}
              className="w-full overflow-y-auto flex flex-col gap-2"
            >
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="noEmployee"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Employee Number
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="employee"
                      value={formData.employee}
                      placeholder="Call title"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="bank"
                    className="block text-xs font-bold text-gray-700"
                  >
                  Bank Name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <User />
                    </span>
                    <input
                      type="text"
                      name="bank"
                      value={formData.bank}
                      placeholder="Bank number"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="year"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Year of establishment
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      placeholder="year of establishment"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-700"
                  >
                 Phone
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      placeholder="Phone number"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700"
                  >
                 Email
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      placeholder="Type the email"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="box"
                    className="block text-xs font-bold text-gray-700"
                  >
                 PO box
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="box"
                      value={formData.box}
                      placeholder="PO box"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
          
              </div>

             <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-xs font-bold text-gray-700"
                  >
                 Address
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="address"
                      name="address"
                      value={formData.address}
                      placeholder="Address"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
             

              <div className="w-full flex justify-center mt-10 space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  type="button"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          {selectedInfo === "category" && (
             <form
              // onSubmit={handleSubmit}
              className="w-full overflow-y-auto flex flex-col gap-2"
            >
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="province"
                    className="block text-xs font-bold text-gray-700"
                  >
                  Province
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      placeholder="Province"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="district"
                    className="block text-xs font-bold text-gray-700"
                  >
                  District
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <User />
                    </span>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      placeholder="District"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="sector"
                    className="block text-xs font-bold text-gray-700"
                  >
                   Sector
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      placeholder="sector"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="cell"
                    className="block text-xs font-bold text-gray-700"
                  >
                 Cell
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="cell"
                      value={formData.cell}
                      placeholder="Cell"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
             

             <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-xs font-bold text-gray-700"
                  >
                 Village
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="village"
                      name="village"
                      value={formData.village}
                      placeholder="Village"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
             

              <div className="w-full flex justify-center mt-10 space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  type="button"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CompleteProfile;
