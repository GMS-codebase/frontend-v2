import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  SolarAddSquareBold,
  SolarCheckCircleBold,
  SolarUploadBold,
} from "../core/icons";
import { SolarDocumentsBold } from "@/components/core/icons/index";
import TextArea from "../ApplicantDetails/TextArea";
import { Modal, Select } from "@mantine/core";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { BsPerson } from "react-icons/bs";
interface FormData {
  financeinfo: string;
  ohs: string;
  equipmentinfo: string;
  workplaceinfo: string;
  comment: string;
  decision: string;
  attachment: File | null;
  traineeNumber: any;
}

const decisions = [
  { value: "APPROVED", label: "Approve" },
  { value: "REJECTED", label: "Reject" },
];

const MakeFirstDueDiligencyDecision = ({
  isOpenModal,
  closeModal,
  application,
  afterMakeDecision,
}: {
  isOpenModal: boolean;
  closeModal: () => void;
  afterMakeDecision: () => void;
  application: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    financeinfo: "",
    ohs: "",
    equipmentinfo: "",
    workplaceinfo: "",
    comment: "",
    decision: "",
    attachment: null,
    traineeNumber: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    if (!formData.decision) {
      newErrors.decision = "Decision is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      console.log(formData);
      submitData.append("financeInfo", formData.financeinfo);
      submitData.append("ohsinfo", formData.ohs);
      submitData.append("equipmentinfo", formData.equipmentinfo);
      submitData.append("workPlaceInfo", formData.workplaceinfo);
      submitData.append("traineeNumber", formData.traineeNumber);
      submitData.append("comment", formData.comment);
      submitData.append("decision", formData.decision);
      if (formData.attachment) {
        submitData.append("attachment", formData.attachment);
      }

      await authorizedApi.post(
        `/application/${application?.uuid}/submit/due-diligency-form`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notifications.show({
        message: "Due diligence details are submitted successfully",
        color: "blue",
      });

      setFormData({
        financeinfo: "",
        ohs: "",
        equipmentinfo: "",
        workplaceinfo: "",
        comment: "",
        decision: "",
        attachment: null,
        traineeNumber: null,
      });
      afterMakeDecision();
      closeModal();
    } catch (error: any) {
      console.error(error);
      notifications.show({
        message:
          error.response?.data?.message ??
          "Failed to submit due diligence details!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="lg"
      opened={isOpenModal}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-[90vh] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center px-6">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeModal}
        >
          <IoMdClose />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-700">
            Due Diligence Decision Details
          </h1>
        </div>
        <div className="w-full flex flex-col items-center mt-10 overflow-hidden modal">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full flex flex-col">
              <label
                htmlFor="decision"
                className="block font-semibold text-sm text-gray-700"
              >
                Decision
              </label>
              <Select
                name="decision"
                value={formData.decision}
                onChange={(value: any) =>
                  setFormData({ ...formData, decision: value })
                }
                data={decisions}
                placeholder="Select your decision"
                className="bg-gray-100 rounded-full py-0.5"
                required
              />
              {errors.decision && (
                <span className="text-red-500 text-xs">{errors.decision}</span>
              )}
            </div>

            <div>
              <label
                htmlFor="attachment"
                className="block text-xs font-bold text-gray-700"
              >
                Attachment
              </label>
              <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="attachment"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  {!formData.attachment ? (
                    <>
                      <SolarUploadBold className="text-blue-500 text-3xl" />
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Upload file</p>
                        <p className="text-xs text-gray-400">
                          or drag and drop
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>
                        <SolarCheckCircleBold />
                      </span>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">File Uploaded</p>
                        <p className="text-xs text-gray-400">
                          {formData?.attachment?.name}
                        </p>
                      </div>
                    </>
                  )}
                </label>
                <input
                  id="attachment"
                  type="file"
                  name="attachment"
                  accept=".pdf"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  required
                />
              </div>
            </div>

            {formData.decision === "APPROVED" && (
              <div className="space-y-3 mb-4">
                <div>
                  <div className="w-full">
                    <label
                      htmlFor="trade"
                      className="block  font-bold text-gray-700 text-xs"
                    >
                      Accepted Trainee Number
                    </label>
                    <div className="flex-grow flex items-center gap-2 p-2 bg-gray2 rounded-2xl">
                      <BsPerson className="w-5 h-5" />
                      <input
                        type="number"
                        name="traineeNumber"
                        value={formData.traineeNumber}
                        placeholder="Number of trainees"
                        className="outline-none flex-grow  bg-transparent"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {["Finance Info", "OHS", "Equipment Info", "Work Place Info"].map(
              (field, idx) => (
                <div key={idx} className="py-1 w-full">
                  <label
                    className="block text-sm text-gray-600 capitalize"
                    htmlFor={field}
                  >
                    {field}:
                  </label>
                  <textarea
                    id={field.toLowerCase().replace(/\s+/g, "")}
                    name={field.toLowerCase().replace(/\s+/g, "")}
                    value={
                      formData[
                        field
                          .toLowerCase()
                          .replace(/\s+/g, "") as keyof FormData
                      ] as string
                    }
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full p-6 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
              )
            )}

            <div className="py-4 w-full">
              <label className="block text-sm text-gray-600" htmlFor="comment">
                Comment:
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="mt-2 p-2 w-full border border-primary resize-none rounded-xl shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
              />
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4 mb-2">
              <button
                type="button"
                onClick={closeModal}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Make Decision"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MakeFirstDueDiligencyDecision;
