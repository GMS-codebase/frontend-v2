import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { SolarDocumentBold } from "@/components/core/icons/index";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { Select } from "@mantine/core";

interface MakeEvaluationDecisionProps {
  applicationId: string;
  isOpenAddEval: boolean;
  closeAddEval: () => void;
  onMakeDecision: () => void;
  openEditModal: () => void;
}

const MakeEvaluationDecision = ({
  applicationId,
  isOpenAddEval,
  closeAddEval,
  onMakeDecision,
  openEditModal,
}: MakeEvaluationDecisionProps) => {
  const [formData, setFormData] = useState({
    decision: "",
    comment: "",
  });
  const [errors, setErrors] = useState({
    decision: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof { decision: string; comment: string }]) {
      setErrors((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { decision: "", comment: "" };

    if (!formData.decision) {
      newErrors.decision = "Decision is required.";
      valid = false;
    }

    if (!formData.comment) {
      newErrors.comment = "Comment is required.";
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
      await authorizedApi.patch(
        `/application/evaluation/make-decision/${applicationId}`,
        formData
      );
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
      onMakeDecision();
      closeAddEval();
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
      size={""}
      opened={isOpenAddEval}
      onClose={closeAddEval}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh]   relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddEval}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            Evaluation decision details
          </h1>
        </div>
        <div className="w-11/12 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full  overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="decision"
                  className="block text-xs font-bold text-gray-700"
                >
                  Decision
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <SolarDocumentBold />
                  </span>
                  <Select
                    name="decision"
                    value={formData.decision}
                    onChange={(value: any) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        decision: value,
                      }));
                      if (errors.decision) {
                        setErrors((prevData) => ({
                          ...prevData,
                          decision: "",
                        }));
                      }
                    }}
                    data={[
                      { label: "Approve", value: "APPROVED" },
                      { label: "Reject", value: "REJECTED" },
                    ]}
                    className="mt-1 block w-full  pl-6 text-gray-400  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Select your decision"
                    required
                  />
                </div>
                {errors.decision && (
                  <p className="text-red-500 text-sm">{errors.decision}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="comment"
                className="block text-xs font-bold text-gray-700"
              >
                Comment
              </label>
              <div className="w-full relative">
                <input
                  type="text"
                  name="comment"
                  value={formData.comment}
                  placeholder="Provide a comment"
                  onChange={handleChange}
                  className="mt-1 block w-full pb-28 pt-2 pl-8 px-6 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
              </div>
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddEval}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Loading.." : "Make Decision"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MakeEvaluationDecision;
