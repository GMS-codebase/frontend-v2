import { ADD_WINDOW_SUCCESS } from "@/actions/WindowsActions";
import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { SolarUploadBold } from "../core/icons";
import { SolarDocumentsBold } from "@/components/core/icons/index";
import TextArea from "../ApplicantDetails/TextArea";
import { Select } from "@mantine/core";

const decisions = [
  { value: "decision1", label: "Decision 1" },
  { value: "decision2", label: "Decision 2" },
  { value: "decision3", label: "Decision 3" },
];

const DueDetails = ({
  isOpenAddDue,
  closeAddDue,
}: {
  isOpenAddDue: boolean;
  closeAddDue: () => void;
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added error state

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message on input change
    }));
  };

  const handleSelectChange = (value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      title: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      title: "", // Clear error message on input change
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) {
      newErrors.title = "Decision is required";
      hasError = true;
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const response = await authorizedApi.post(
        "/applications/due-diligency",
        formData
      );
      notifications.show({
        message: "Due diligence details are submitted successfully",
        color: "blue",
      });
      dispatch({
        type: ADD_WINDOW_SUCCESS,
        payload: response.data?.data?.data,
      });
      setFormData({
        title: "",
        description: "",
      });
      closeAddDue();
    } catch (error: any) {
      console.error(error); // Log error for debugging
      notifications.show({
        message:
          error.response?.data?.message ??
          "Failed to submit due diligence details!",
        color: "red",
      });
    }
  };

  return (
    <Modal
      size={"xl"}
      opened={isOpenAddDue}
      onClose={closeAddDue}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-[90vh] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddDue}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            Due Diligence Decision Details
          </h1>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full flex flex-col">
              <label
                htmlFor="title"
                className="block font-semibold text-sm text-gray-700"
              >
                Decision
              </label>
              <Select
                name="title"
                value={formData.title}
                onChange={handleSelectChange}
                data={decisions}
                placeholder="Select your decision"
                classNames={{
                  input:
                    "mt-1 block w-full text-gray-400 py-2 bg-[#000F230A] rounded-2xl shadow-sm",
                }}
                required
              />
              {errors.title && (
                <span className="text-red-500 text-xs">{errors.title}</span>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-sm">Attachment</h3>
              <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <SolarUploadBold className="text-blue-500 text-3xl" />
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Upload file</p>
                    <p className="text-xs text-gray-400">or drag and drop</p>
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

            <div className="flex flex-col">
              <h3 className="font-semibold text-sm">Finance Info</h3>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddDue}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Make Decision
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default DueDetails;