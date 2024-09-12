import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Upload } from "solar-icon-set";
import { SolarAddSquareBold } from "../core/icons";

interface AddContractProps {
  data: any;
  isOpenAddContract: boolean;
  closeAddContract: () => void;
}

const AddContract: React.FC<AddContractProps> = ({
  data,
  isOpenAddContract,
  closeAddContract,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ name: string; file: File | null }>(
    {
      name: "",
      file: null,
    }
  );

  const [tradeTrainees, setTradeTrainees] = useState([
    { trade: "", trainees: "" },
  ]);

  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    // const { name, value, files } = e.target;
    // if (name === "file") {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: files ? files[0] : value,
    //   }));
    // } else if (index !== undefined) {
    //   const updatedTradeTrainees = [...tradeTrainees];
    //   updatedTradeTrainees[index][name] = value;
    //   setTradeTrainees(updatedTradeTrainees);
    // }
  };

  const handleAdd = () => {
    setTradeTrainees([...tradeTrainees, { trade: "", trainees: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newData = {
      name: formData.name,
      contract: formData.file,
      applicantId: data.applicant.uuid,
      applicationId: data?.uuid,
      tradeTrainees: tradeTrainees,
    };

    const submitForm = new FormData();
    submitForm.append("name", newData.name);
    submitForm.append("contract", newData.contract as Blob);
    submitForm.append("applicantId", newData.applicantId);
    submitForm.append("applicationId", newData.applicationId);

    try {
      const res = await authorizedApi.post("/contracts", submitForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      notifications.show({
        message: res?.data?.message,
        color: "blue",
      });
      setFormData({ file: null, name: "" });
      closeAddContract();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to create contract",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpenAddContract}
      onClose={closeAddContract}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      size={"lg"}
    >
      <div className=" h-fit relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddContract}
        >
          <IoMdClose size={25} color="#000" />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Ammend Contract info</h1>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-2 px-2"
          >
            <div className="w-full my-2">
              <label
                htmlFor="fileUpload"
                className="block text-md font-bold text-gray-700"
              >
                Meeting minutes
              </label>
              <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Upload className="text-[#005DE9] w-64 h-64 " />
                  {formData.file ? (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Uploaded file</p>
                      <p className="text-md text-gray-400">
                        {formData?.file?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Upload file</p>
                      <p className="text-md text-gray-400">or drag and drop</p>
                    </div>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="w-full my-2">
              <label
                htmlFor="fileUpload"
                className="block text-md font-bold text-gray-700"
              >
                Contract
              </label>
              <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Upload className="text-[#005DE9] w-64 h-64 " />
                  {formData.file ? (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Uploaded file</p>
                      <p className="text-md text-gray-400">
                        {formData?.file?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Upload file</p>
                      <p className="text-md text-gray-400">or drag and drop</p>
                    </div>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-3 mb-3">
              {tradeTrainees.map((item, index) => (
                <div key={index} className="w-full flex justify-between">
                  <div className="w-full">
                    <label
                      htmlFor="trade"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Trade/Number of trainees
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <BsPerson className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        name="trade"
                        value={item.trade}
                        placeholder="Trade"
                        className="mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-s-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="mt-5 w-full relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <BsPerson className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        name="trainees"
                        value={item.trainees}
                        placeholder="Number of trainees"
                        className="mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-e-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => handleChange(e, index)}
                      />
                      <span
                        className="absolute bg-blue-500 bg-opacity-15 py-1 rounded-2xl px-2 right-2 top-1/2 -translate-y-1/2 gap-1 flex "
                        onClick={handleAdd}
                      >
                        <SolarAddSquareBold className="mt-[1px] w-5 h-5 text-blue-500" />{" "}
                        <div className="text-blue-500">Add</div>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-3">
                <div className="w-full flex justify-between gap-3">
                  <div className="w-full">
                    <label
                      htmlFor="firstInstall"
                      className="block text-xs font-bold text-gray-700"
                    >
                      1st Installment percentage
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <BsPerson className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        name="firstInstall"
                        // value={formData.firstInstall}
                        placeholder="Number of trainees"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                          "
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="secInstall"
                      className="block text-xs font-bold text-gray-700"
                    >
                      2nd Installment percentage
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <BsPerson className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        name="secInstall"
                        // value={formData.SecInstall}
                        placeholder="Number of trainees"
                        className="mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                          "
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="thirdInstall"
                      className="block text-xs font-bold text-gray-700"
                    >
                      3rd Installment percentage
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <BsPerson className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        name="thirdInstall"
                        // value={formData.thirdInstall}
                        placeholder="Number of trainees"
                        className="mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                          "
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddContract}
                className="w-full px-4 py-3 bg-black text-white rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full"
              >
                {loading ? "Loading..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddContract;
