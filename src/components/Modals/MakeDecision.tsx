import { Modal, Select } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { SolarDocumentBold, SolarAddSquareBold } from "@/components/core/icons";
import { BsPerson } from "react-icons/bs";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";

interface MakeDecisionProps {
  isOpen: boolean;
  close: () => void;
  onMakeDecision: () => void;
  type: "Evaluation" | "Due Diligence";
  defaultData?: {
    decision: string;
    comment: string;
    tradeTrainees?: { trade: any; trainees: number }[];
  };
  firstEvaluationModal?: boolean;
  application?: { trades: { uuid: string; title: string }[] };
}

const MakeDecision = ({
  isOpen,
  close,
  onMakeDecision,
  type,
  defaultData,
  firstEvaluationModal,
  application,
}: MakeDecisionProps) => {
  const [formData, setFormData] = useState({
    decision: "",
    comment: "",
    tradeTrainees: [] as { trade: any; trainees: number }[],
  });
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState({
    decision: "",
    comment: "",
    tradeTrainees: "",
  });
  const [loading, setLoading] = useState(false);

  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [traineesNumber, setTraineesNumber] = useState<number | undefined>(0);

  useEffect(() => {
    if (defaultData) {
      setFormData(defaultData as any);
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
    const newErrors = { decision: "", comment: "", tradeTrainees: "" };

    if (!formData.decision) {
      newErrors.decision = "Decision is required.";
      valid = false;
    }

    if (!formData.comment) {
      newErrors.comment = "Comment is required.";
      valid = false;
    }

    if (firstEvaluationModal && formData.tradeTrainees.length === 0) {
      newErrors.tradeTrainees = "At least one trade/trainee entry is required.";
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
      const endpoint =
        type === "Evaluation"
          ? `/application/evaluation/make-decision/${id}`
          : `/application/${id}/due-diligency-form/make-decision`;

      const apiMethod =
        type === "Evaluation" ? authorizedApi.patch : authorizedApi.post;

      await apiMethod(endpoint, formData);

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

  const addTradeTrainee = () => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          tradeTrainees: [
            ...prev.tradeTrainees,
            { trade: selectedTrade, trainees: traineesNumber },
          ],
        }) as any
    );
    setSelectedTrade(null);
    setTraineesNumber(0);
  };

  const removeTradeTrainee = (uuid: string) => {
    setFormData((prev) => ({
      ...prev,
      tradeTrainees: prev.tradeTrainees.filter(
        (entry) => entry.trade.uuid !== uuid
      ),
    }));
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
                className="mt-1 block w-full pb-28 pt-2 pl-8 bg-[#000F230A] rounded-2xl"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

            {firstEvaluationModal && formData.decision === "APPROVED" && (
              <div className="space-y-3 mb-4">
                <p>Trades and Trainees</p>
                <div className="w-full flex gap-2">
                  <Select
                    value={selectedTrade?.uuid || ""}
                    onChange={(value) =>
                      setSelectedTrade(
                        application?.trades.find((t) => t.uuid === value)
                      )
                    }
                    data={application?.trades.map((t) => ({
                      value: t.uuid,
                      label: t.title,
                    }))}
                    placeholder="Select trade"
                  />
                  <input
                    type="number"
                    value={traineesNumber || ""}
                    onChange={(e) =>
                      setTraineesNumber(parseInt(e.target.value))
                    }
                    placeholder="Number of trainees"
                    className="outline-none flex-grow bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTradeTrainee}
                    disabled={!selectedTrade || !traineesNumber}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full"
                  >
                    Add
                  </button>
                </div>
                {formData.tradeTrainees.length > 0 && (
                  <table>
                    <thead>
                      <tr>
                        <th>Trade</th>
                        <th>Trainees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.tradeTrainees.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.trade.title}</td>
                          <td>{entry.trainees}</td>
                          <td>
                            <button
                              onClick={() =>
                                removeTradeTrainee(entry.trade.uuid)
                              }
                              className="text-red-500"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {errors.tradeTrainees && (
                  <p className="text-red-500 text-sm">{errors.tradeTrainees}</p>
                )}
              </div>
            )}

            <div className="flex justify-center mt-4 space-x-4">
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
