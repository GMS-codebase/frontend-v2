import { Modal, Select } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";
import { AiOutlineDelete } from "react-icons/ai";

interface MakeDecisionProps {
  isOpen: boolean;
  close: () => void;
  onMakeDecision: () => void;
  type: "Evaluation" | "Due Diligence";
  defaultData?: {
    decision: string;
    comment: string;
    trades?: { trade: any; trainees: number }[];
  };
  firstEvaluationModal?: boolean;
  application?: any;
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
    trades: [] as { trade: any; trainees: number }[],
  });
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState({
    decision: "",
    comment: "",
    trades: "",
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
    const newErrors = { decision: "", comment: "", trades: "" };

    if (!formData.decision) {
      newErrors.decision = "Decision is required.";
      valid = false;
    }

    if (!formData.comment) {
      newErrors.comment = "Comment is required.";
      valid = false;
    }

    if (firstEvaluationModal && formData.trades.length === 0) {
      newErrors.trades = "At least one trade/trainee entry is required.";
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
    setFormData((prev: any) => {
      const existingTradeIndex = prev.trades.findIndex(
        (trade: any) => trade.trade === selectedTrade,
      );
      if (existingTradeIndex !== -1) {
        const updatedTrades = [...prev.trades];
        updatedTrades[existingTradeIndex].trainees = traineesNumber;
        return {
          ...prev,
          trades: updatedTrades,
        };
      } else {
        return {
          ...prev,
          trades: [
            ...prev.trades,
            { trade: selectedTrade, trainees: traineesNumber },
          ],
        };
      }
    });
    setSelectedTrade(null);
    setTraineesNumber(0);
  };

  const removeTradeTrainee = (uuid: string) => {
    setFormData((prev) => ({
      ...prev,
      trades: prev.trades.filter((entry) => entry.trade.uuid == uuid),
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
                  Trades and Trainees
                </p>
                <div className="w-full flex gap-2">
                  <Select
                    value={selectedTrade}
                    onChange={(value) => setSelectedTrade(value)}
                    data={application?.trades.map((t: any) => ({
                      value: t.trade.uuid,
                      label: t.trade.title,
                    }))}
                    placeholder="Select trade"
                    className="bg-gray-100 rounded-full py-0.5"
                  />
                  <input
                    type="number"
                    value={traineesNumber || ""}
                    onChange={(e) =>
                      setTraineesNumber(parseInt(e.target.value))
                    }
                    placeholder="Number of trainees"
                    className="outline-none flex-grow bg-gray-100 rounded-full px-3"
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
                {formData.trades.length > 0 && (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Trade</th>
                        <th>Trainees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.trades.map((entry: any, index) => (
                        <tr key={index}>
                          <td>
                            {" "}
                            <div className="flex items-center justify-center">
                              {
                                application?.trades.find(
                                  (t: any) => t.trade.uuid === entry.trade,
                                )?.trade.title
                              }
                            </div>{" "}
                          </td>
                          <td>
                            {" "}
                            <div className="flex items-center justify-center">
                              {entry.trainees}
                            </div>{" "}
                          </td>
                          <td>
                            {" "}
                            <div className="flex items-center justify-center">
                              {" "}
                              <button
                                type="button"
                                onClick={() =>
                                  removeTradeTrainee(entry.trade.uuid)
                                }
                                className="text-red-500"
                              >
                                <AiOutlineDelete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {errors.trades && (
                  <p className="text-red-500 text-sm">{errors.trades}</p>
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
