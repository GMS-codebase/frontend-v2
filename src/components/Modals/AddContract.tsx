import { authorizedApi } from "@/utils/api";
import { Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { FileDownload, Folder2, Subtitles, Upload, UserCircle } from "solar-icon-set";

const AddContract = ({
  isOpenAddContract,
  closeAddContract,
}: {
  isOpenAddContract: boolean;
  closeAddContract: () => void;
}) => {
  const [formData, setFormData] = useState({
    applicant: "",
    title:"",
    file: "",
  });
  const dispatch = useDispatch();
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    authorizedApi
      .post("/contract", formData)
      .then((res) => {
        notifications.show({
          message: "Trade is created successfully",
          color: "blue",
        });
        setFormData({
          applicant: "",
          file: "",
          title:"",
        });
        closeAddContract();
      })
      .catch((err) => {
        if (err.response)
          notifications.show({
            message: err.response?.data?.message ?? "Failed to create contract",
            color: "red",
          });
      });
  };

  return (
    <>
      <Modal
        size={""}
        opened={isOpenAddContract}
        onClose={closeAddContract}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
      >
        <div className="w-[80vh] h-[600px] relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
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
              className="w-full h-[60vh] overflow-y-auto flex flex-col gap-2 px-2"
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
                      name="title"
                      value={formData.title}
                      placeholder="Contract name"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A]  rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
                 <div className="">
        <label
          htmlFor="applicant"
          className="block text-md font-bold text-gray-700"
        >
          Select  Applicant name
        </label>
        <div className="mt-1 py-1 pl-8 relative block bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <span className="absolute left-4 top-[5px]">
            <UserCircle className="w-10 h-10 mt-2" />
          </span>
          <Select
            name="applicant"
            data={[
              { value: "leslie", label: "Uhiriwe Anne Leslie" },
              { value: "octave", label: "Iradukunda Octave" },
          
            ]}
            placeholder="Select file"
            required
          />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddContract;
