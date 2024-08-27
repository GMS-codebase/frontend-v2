import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Folder2, Upload } from "solar-icon-set";

interface AddContractProps {
  data: any; // Replace `any` with the actual type if available
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
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const newData = {
      name: formData.name,
      contract: formData.file,
      applicantId: data.applicant.uuid,
      applicationId: data?.uuid,
    };

    try {
      const res = await authorizedApi.post("/contracts", newData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notifications.show({
        message: res?.data?.message,
        color: "blue",
      });
      setFormData({
        file: null,
        name: "",
      });
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
      size={""}
    >
      <div className="w-[80vh] h-fit relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddContract}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Create New Contract</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your Contract details to create a new contract.
          </h2>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-2 px-2"
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="TradeTitle"
                  className="block text-md font-bold text-gray-700"
                >
                  Contract name
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <Folder2 />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Contract name"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A]  rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="w-full my-5">
              <label
                htmlFor="fileUpload"
                className="block text-md font-bold text-gray-700"
              >
                Attachment
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

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddContract}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
