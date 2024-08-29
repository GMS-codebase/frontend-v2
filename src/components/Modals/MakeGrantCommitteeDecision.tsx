import { ADD_WINDOW_SUCCESS } from "@/actions/WindowsActions";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState, ChangeEvent } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Modal, MultiSelect, Select } from "@mantine/core";
import {
  SolarDocumentsBold,
  SolarAddSquareBold,
  SolarUploadBold,
} from "../core/icons";
import TextArea2 from "../textarea2";
import TextArea from "../ApplicantDetails/TextArea";
import { Upload } from "solar-icon-set";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onMakeDecision: () => void;
  applicationId: string;
  trades: { uuid: string; title: string }[];
}

interface FormData {
  decision: string;
  description: string;
  trades: string[];
  numberOfTrainees: string;
  attachment: File | null;
}

interface FormErrors {
  decision?: string;
  trades?: string;
  description?: string;
  numberOfTrainees?: string;
  attachment?: string;
}

const MakeGrantCommitteeDecision = ({
  isOpen,
  closeModal,
  onMakeDecision,
  applicationId,
  trades,
}: Props) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    decision: "",
    description: "",
    trades: [],
    numberOfTrainees: "",
    attachment: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (
    name: keyof FormData,
    value: FormData[keyof FormData]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      attachment: file,
    }));
    if (errors.attachment) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        attachment: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.decision) {
      newErrors.decision = "Decision is required.";
      isValid = false;
    }
    if (formData.trades.length === 0) {
      newErrors.trades = "At least one trade must be selected.";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "Description is required.";
      isValid = false;
    }
    if (!formData.numberOfTrainees) {
      newErrors.numberOfTrainees = "Number of trainees is required.";
      isValid = false;
    }
    if (!formData.attachment) {
      newErrors.attachment = "Attachment is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("decision", formData.decision);
    formDataToSubmit.append("comment", formData.description);
    formDataToSubmit.append("trades", JSON.stringify(formData.trades));
    formDataToSubmit.append("numberOfTrainees", formData.numberOfTrainees);
    if (formData.attachment) {
      formDataToSubmit.append("attachment", formData.attachment);
    }

    try {
      await authorizedApi.post(
        `/application/grant-committee/decision/${applicationId}`,
        formDataToSubmit
      );
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
      onMakeDecision();
      closeModal();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    }
    setLoading(false);
  };

  const multiSelectData = trades?.map((trade) => ({
    value: trade.uuid,
    label: trade.title,
  }));

  return (
    <Modal
      size={"xl"}
      opened={isOpen}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full max-h-[90vh] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center overflow-y-auto">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeModal}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Make decision</h1>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 ">
          <form
            className="w-full overflow-y-auto flex flex-col gap-4 px-2"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="WindowTitle"
                  className="block font-semibold text-sm text-gray-700"
                >
                  Decision
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <SolarDocumentsBold />
                  </span>
                  <Select
                    name="decision"
                    value={formData.decision}
                    onChange={(value) => handleSelectChange("decision", value)}
                    data={[
                      { label: "Approve", value: "APPROVED" },
                      { label: "Reject", value: "REJECTED" },
                    ]}
                    className="mt-1 block w-full pl-6 text-gray-400 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Select your decision"
                    required
                  />
                  {errors.decision && (
                    <p className="text-red-500 text-xs">{errors.decision}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="trade"
                className="block text-base font-medium text-black"
              >
                Choose Trades
              </label>
              <div className="mt-1 pl-6 relative w-full bg-[#000F230A] py-1 block rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-black text-lg">
                  <SolarDocumentsBold />
                </span>
                <div className="flex items-center justify-between ">
                  <MultiSelect
                    name="trades"
                    disabled={!multiSelectData?.length}
                    onChange={(value) => handleSelectChange("trades", value)}
                    data={multiSelectData}
                    placeholder="Select or type in a trade"
                    className="w-full"
                    required
                  />
                </div>
              </div>
              {errors.trades && (
                <p className="text-red-500 text-xs">{errors.trades}</p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="numberOfTrainees"
                className="block font-semibold text-sm text-gray-700"
              >
                Number of Trainees
              </label>
              <input
                type="number"
                className="bg-gray-100 w-full p-2 rounded-2xl outline-none border"
                name="numberOfTrainees"
                value={formData.numberOfTrainees}
                onChange={handleChange}
              />
              {errors.numberOfTrainees && (
                <p className="text-red-500 text-xs">
                  {errors.numberOfTrainees}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="description"
                className="block font-semibold text-sm text-gray-700"
              >
                Description
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
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
                  htmlFor="attachment"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Upload className="text-[#005DE9] w-64 h-64" />
                  {formData.attachment ? (
                    <div className="text-center">
                      <p className="text-md font-medium text-gray-700">
                        {formData.attachment.name}
                      </p>
                      <p className="text-sm text-gray-500">File selected</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Upload file</p>
                      <p className="text-md text-gray-400">or drag and drop</p>
                    </div>
                  )}
                </label>
                <input
                  id="attachment"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 hidden w-full text-gray-400 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              {errors.attachment && (
                <p className="text-red-500 text-xs">{errors.attachment}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-5  mt-6">
              <button
                type="button"
                className=" py-2 bg-primaryText text-white rounded-full flex items-center justify-center disabled:opacity-50"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" py-2 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MakeGrantCommitteeDecision;
