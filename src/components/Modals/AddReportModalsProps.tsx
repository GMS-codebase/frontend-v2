import { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  FileInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IoMdClose } from "react-icons/io";
import { CalendarMinimalistic, Upload } from "solar-icon-set";
import { useDispatch, useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ADD_MEREPORT_SUCCESS } from "@/actions/MEReportsActions";

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddReportModal = ({ isOpen, onClose }: AddReportModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<any>({
    initialValues: {
      title: "",
      call: "",
      description: "",
      report: "",
      start_date: "",
      end_date: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    form.setFieldValue(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      form.setFieldValue("report", file);
    }
  };

  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    console.log(form.values.report);
    const submitForm = new FormData();
    submitForm.append("title", form.values.title);
    submitForm.append("call", form.values.call);
    submitForm.append("description", form.values.description);
    if (form.values.report) {
      submitForm.append("report", form.values.report);
    }
    submitForm.append("start_date", form.values.start_date);
    submitForm.append("end_date", form.values.end_date);

    try {
      const res = await authorizedApi.post("/report", submitForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: ADD_MEREPORT_SUCCESS, payload: res.data.data });
      notifications.show({
        message: "M&E report created successfully",
        color: "blue",
      });
      form.reset();
      onClose();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to create report!",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calls = useSelector((state: any) => state.calls);
  const callsSelector = calls?.calls?.map((call: any) => {
    return { value: call?.uuid, label: call?.title };
  });

  return (
    <div>
      <Modal
        size=""
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="w-[40vw] h-[800px] flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative overflow-y-auto">
          <div className="absolute top-3 right-3 m-4 text-center mt-0">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-center font-bold mb-4">
            <h2 className="text-2xl font-bold text-primaryText">
              Add new report
            </h2>
          </div>

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-primaryText"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold">
                Report title
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="name"
                  placeholder="Type in report title"
                  name="title"
                  value={form.values.title}
                  onChange={handleChange}
                  className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-4 outline-primary transition-all duration-150"
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

            <div className="flex flex-col gap-2">
              <label htmlFor="call" className="font-semibold">
                Call
              </label>
              <div className="relative w-full">
                <Select
                  data={callsSelector}
                  className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-2 outline-primary transition-all duration-150"
                  onChange={(value: any) => form.setFieldValue("call", value)}
                  value={form.values.call}
                />
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
                    name="start_date"
                    value={form.values.start_date}
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
                    name="end_date"
                    value={form.values.end_date}
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
              <div className="flex mt-1 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer w-full h-full p-4"
                >
                  <Upload className="text-[#005DE9] w-64 h-64 " />
                  <div className="text-center">
                    <p className="text-md text-gray-500">Upload file</p>
                    <p className="text-md text-gray-400">or drag and drop</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    name="report"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    required
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="border mt-4 text-center bg-primary rounded-full p-2 text-white font-semibold text-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add new report"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddReportModal;
