import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { getApplications } from "@/services";
import { useDispatch } from "react-redux";

interface GeneralCommentModalProps {
  isOpen: boolean;
  close: () => void;
  onClose: () => void;
  application?: any;
  type: "EVALUATION" | "DUE_DILIGENCY";
}
const GeneralCommentModal = ({
  isOpen,
  close,
  onClose,
  application,
  type,
}: GeneralCommentModalProps) => {
  const dispatch = useDispatch();
  const isEditing =
    application?.evaluationFinalDecision || application?.dueFinalDecision;
  const [formData, setFormData] = useState({
    comment:
      type === "EVALUATION"
        ? (application?.evaluationFinalDecision ?? "")
        : (application?.dueFinalDecision ?? ""),
  });
  const [errors, setErrors] = useState({
    comment: "",
  });
  useEffect(() => {
    setFormData({
      comment:
        type === "EVALUATION"
          ? (application?.evaluationFinalDecision ?? "")
          : (application?.dueFinalDecision ?? ""),
    });
  }, [application, type]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { comment: "" };

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
      const payload = {
        comment: formData.comment,
      };

      await authorizedApi.patch(
        `/application/make-final-comment/${application?.uuid}/stage/${type}`,
        payload,
      );
      notifications.show({
        message: "General comment saved successfully!",
        color: "blue",
      });
      onClose();
      getApplications(dispatch);
      close();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    }
    setLoading(false);
  };

  console.log("decisions ---> ", application)
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
          <h1 className="text-2xl font-extrabold">
            {isEditing ? "View general comment" : "Provide a general comment"}
          </h1>
        </div>
        <div className="w-11/12 flex flex-col items-center mt-10 overflow-hidden gap-3">
          {type === "DUE_DILIGENCY" && 
            <div className="w-full flex gap-6 justify-start items-center">
            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
              Approved trainees
            </p>
            <p className="text-base font-bold">
              {application?.duediligencyDecisions?.[0]?.numberOfTrainees}
            </p>
          </div>
          }
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="comment"
                className="block text-xs font-bold text-gray-700"
              >
                General Comment
              </label>
              <textarea
                name="comment"
                defaultValue={
                  type === "EVALUATION"
                    ? (application?.evaluationFinalDecision ?? "")
                    : (application?.dueFinalDecision ?? "")
                }
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Provide a comment"
                className="mt-1 block w-full pb-28 pt-2 px-3  bg-[#000F230A] rounded-2xl outline-none"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

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
                {loading ? "Submitting..." : isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default GeneralCommentModal;
