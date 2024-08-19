import { useState } from "react";
import { Modal, TextInput, Textarea, Button, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IoMdClose } from "react-icons/io";
import { CalendarMinimalistic, Upload } from "solar-icon-set";

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddReportModal = ({ isOpen, onClose }: AddReportModalProps) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      file: null,
      startDate: "",
      endDate: "",
    },
  });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    form.setFieldValue(name, files ? files[0] : value);
  };

  const handleSubmit = (values: any) => {
    // console.log("Form submitted:", values);
    onClose(); // Close the modal after submission
  };

  return (
    <div>
      <Modal
        size=""
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        centered
      >
        <div className="w-[40vw] h-[80vh] flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
          <div className="absolute top-3 right-3 m-4 text-center mt-0">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-center font-bold mb-4">
            <h2 className="text-2xl font-bold text-primaryText">Add new report</h2>
          </div>

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-primaryText"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold">
                Report name
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="name"
                  placeholder="Type in report name"
                  name="name"
                  value={form.values.name}
                  onChange={handleChange}
                  className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8 outline-primary transition-all duration-150"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 font-semibold">
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="font-semibold">
                  Description
                </label>
                <div className="relative w-full">
                  <textarea
                    id="description"
                    name="description"
                    value={form.values.description}
                    onChange={handleChange}
                    rows={3}
                    className="p-2 w-full border border-primary rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="startDate"
                  className="block text-xs font-bold text-gray-700"
                >
                  Start Date
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <CalendarMinimalistic />
                  </span>
                  <input
                    type="date"
                    name="startDate"
                    value={form.values.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="endDate"
                  className="block text-xs font-bold text-gray-700"
                >
                  End Date
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <CalendarMinimalistic />
                  </span>
                  <input
                    type="date"
                    name="endDate"
                    value={form.values.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
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
                  name="file"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  required
                />
              </div>
            </div>

            <div className="border mt-4 text-center bg-primary rounded-full p-2 text-white font-semibold text-xl">
              <input type="submit" value="Add new report" />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddReportModal;
