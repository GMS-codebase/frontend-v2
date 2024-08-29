import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { SolarDocumentBold } from "@/components/core/icons/index";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { Select } from "@mantine/core";

interface EvalDetailsProps {
  applicationId: string;
  isOpenAddEval: boolean;
  closeAddEval: () => void;
  onMakeDecision: () => void;
  openEditModal: () => void;
}

const EvalDetails = ({
  applicationId,
  isOpenAddEval,
  closeAddEval,
  onMakeDecision,
  openEditModal,
}: EvalDetailsProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof { title: string; description: string }]) {
      setErrors((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    if (!formData.title) {
      newErrors.title = "Decision is required.";
      valid = false;
    }

    if (!formData.description) {
      newErrors.description = "Comment is required.";
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
      await authorizedApi.post(
        `/application/fillApplication/${applicationId}`,
        formData,
      );
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
      onMakeDecision();
      closeAddEval();
    } catch (err: any) {
      console.log(err.response);
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
                  htmlFor="title"
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
                    value={formData.title}
                    onChange={(value: any) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        title: value,
                      }));
                      if (errors.title) {
                        setErrors((prevData) => ({
                          ...prevData,
                          title: "",
                        }));
                      }
                    }}
                    data={[
                      { label: "Confirm", value: "confirm" },
                      { label: "Reject", value: "reject" },
                    ]}
                    className="mt-1 block w-full  pl-6 text-gray-400  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Select your decision"
                    required
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="description"
                className="block text-xs font-bold text-gray-700"
              >
                Comment
              </label>
              <div className="w-full relative">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  placeholder="Provide a comment"
                  onChange={handleChange}
                  className="mt-1 block w-full pb-28 pt-2 pl-8 px-6 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
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

export default EvalDetails;
