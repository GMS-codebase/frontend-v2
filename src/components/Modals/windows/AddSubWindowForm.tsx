import { Modal, Select } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { SolarSuitcaseLinear, SolarWindowFrameLinear } from "../../core/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { getForms, getWindows } from "@/utils/funcs";
import {
  ADD_TRADE_SECTOR_SUCCESS,
  UPDATE_SECTOR_SUCCESS,
} from "@/actions/SectorsActions";

const AddSubWindowForm = ({
  isOpenAddSubWindowForm,
  closeAddSubWindowForm,
}: {
  isOpenAddSubWindowForm: boolean;
  closeAddSubWindowForm: () => void;
}) => {
  const { subWindowId } = useParams<{ subWindowId: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    form: "",
  });
  const [errors, setErrors] = useState({
    form: "",
  });

  const forms = useSelector((state: any) => state.forms);
  const dispatch = useDispatch();

  const formOptions = forms.forms.map((form: any) => ({
    value: form.uuid,
    label: form?.name,
  }));

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.form) newErrors.form = "Form is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await authorizedApi.patch(
        `/forms/link-with-subWindow/${formData.form}/${subWindowId}`,
        {
          formId: formData.form,
        },
      );
      notifications.show({
        message: "Form assigned to subwindow successfully!",
        color: "blue",
      });
      setFormData({
        form: "",
      });
      getForms(dispatch);
      closeAddSubWindowForm();
    } catch (error: any) {
      notifications.show({
        message: error.response?.data?.message ?? "Failed to assign form!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddSubWindowForm}
      onClose={closeAddSubWindowForm}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl flex flex-col items-center p-16">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddSubWindowForm}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Add Form To Sub Window</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Attach a form to subwindow
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="form"
                className="block text-base font-medium text-black"
              >
                Select Form
              </label>
              <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-black text-lg">
                  <SolarSuitcaseLinear />
                </span>
                <Select
                  name="form"
                  value={formData.form}
                  onChange={(value: any) => handleChange("form", value)}
                  data={formOptions}
                  placeholder="Type in or select form"
                  required
                />
              </div>
              {errors.form && (
                <div className="text-red-600 text-sm mt-1">{errors.form}</div>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddSubWindowForm}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubWindowForm;
