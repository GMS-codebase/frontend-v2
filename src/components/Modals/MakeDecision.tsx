import { Modal, Select } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";

interface MakeDecisionProps {
  isOpen: boolean;
  close: () => void;
  onMakeDecision: () => void;
  type: "Evaluation" | "Due Diligence";
  defaultData?:
    | {
        decision: string;
        comment: string;
        numberOfTrainees: string;
      }
    | any;
  firstEvaluationModal?: boolean;
  application?: any;
  updated?: boolean;
}
const MakeDecision = ({
  isOpen,
  close,
  onMakeDecision,
  type,
  defaultData,
  firstEvaluationModal,
  application,
  updated,
}: MakeDecisionProps) => {
  const [formData, setFormData] = useState({
    decision: "",
    comment: "",
    traineeNumber: "",
  });
  const [errors, setErrors] = useState({
    decision: "",
    comment: "",
    traineeNumber: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (defaultData) {
      setFormData({
        decision: defaultData.decision,
        comment: defaultData.comment,
        traineeNumber: defaultData?.numberOfTrainees as any,
      } as any);
    }
  }, [defaultData]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { decision: "", comment: "", traineeNumber: "" };

    if (!formData.decision) {
      newErrors.decision = "Decision is required.";
      valid = false;
    }

    if (!formData.comment) {
      newErrors.comment = "Comment is required.";
      valid = false;
    }

    if (
      firstEvaluationModal &&
      !formData.traineeNumber &&
      formData.decision === "APPROVED"
    ) {
      newErrors.traineeNumber =
        "Please provide the number of accepted trainees.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        decision: formData.decision,
        comment: formData.comment,
        ...(firstEvaluationModal &&
          formData.decision === "APPROVED" && {
            numberOfTrainees: parseInt(formData.traineeNumber),
          }),
      };
      if (defaultData) {
        const endpoint =
          type === "Evaluation"
            ? `/application/evaluation/update-decision/${application?.uuid}/${defaultData?.uuid}`
            : `/application/${application?.uuid}/due-diligency-form/update-decision/${defaultData?.uuid}`;

        await authorizedApi.patch(endpoint, payload);
      } else {
        const endpoint =
          type === "Evaluation"
            ? `/application/evaluation/make-decision/${application?.uuid}`
            : `/application/${application?.uuid}/due-diligency-form/make-decision`;

        const apiMethod =
          type === "Evaluation" ? authorizedApi.patch : authorizedApi.post;
        await apiMethod(endpoint, payload);
      }

      notifications.show({
        message: defaultData
          ? `${type} decision updated successfully!`
          : `${type} decision made successfully!`,
        color: "blue",
      });
      onMakeDecision();
      close();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      size=""
      opened={isOpen}
      onClose={close}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={close}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">{type} decision details</h1>
        </div>
        <div className="w-11/12 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="decision"
                className="block text-xs font-bold text-gray-700"
              >
                Decision
              </label>
              <Select
                name="decision"
                value={formData.decision}
                onChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, decision: value }))
                }
                data={[
                  { label: "Approve", value: "APPROVED" },
                  { label: "Reject", value: "REJECTED" },
                ]}
                placeholder="Select your decision"
                className="bg-gray-100 rounded-full py-0.5"
              />
              {errors.decision && (
                <p className="text-red-500 text-sm">{errors.decision}</p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="comment"
                className="block text-xs font-bold text-gray-700"
              >
                Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Provide a comment"
                className="mt-1 block w-full pb-28 pt-2 px-3  bg-[#000F230A] rounded-2xl outline-none"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

            {firstEvaluationModal && formData.decision === "APPROVED" && (
              <div className="space-y-3 mb-4 w-full">
                <p className="block text-xs font-bold text-gray-700">
                  {" "}
                  Accepted Trainee Number
                </p>
                <input
                  type="number"
                  value={formData.traineeNumber}
                  onChange={handleChange}
                  min={0}
                  name="traineeNumber"
                  placeholder="Number of trainees"
                  className="outline-none flex-grow bg-gray-100 rounded-full px-3 py-3 w-full"
                />
                {errors.traineeNumber && (
                  <p className="text-red-500 text-sm">{errors.traineeNumber}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2  mt-4 gap-4">
              <button
                type="button"
                onClick={close}
                className="px-4 py-3 bg-black text-white rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-3 bg-blue-500 text-white rounded-full"
              >
                {loading
                  ? "Loading.."
                  : defaultData
                    ? "Update Decision"
                    : "Make Decision"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MakeDecision;
