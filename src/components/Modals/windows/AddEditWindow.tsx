import {
  ADD_WINDOW_SUCCESS,
  UPDATE_WINDOW_SUCCESS,
} from "@/actions/WindowsActions";
import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Folder2, Subtitles } from "solar-icon-set";

interface AddEditWindowProps {
  isOpenAddEditWindow: boolean;
  closeAddEditWindow: () => void;
  defaultData?: any;
}

const AddEditWindow = ({
  isOpenAddEditWindow,
  closeAddEditWindow,
  defaultData,
}: AddEditWindowProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const dispatch = useDispatch();

  // Use useEffect to pre-fill the form if defaultData is provided
  useEffect(() => {
    if (defaultData) {
      setFormData({
        title: defaultData.title || "",
        description: defaultData.description || "",
      });
    }
  }, [defaultData]);

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const request = defaultData
      ? authorizedApi.patch(`/window/${defaultData.uuid}`, formData)
      : authorizedApi.post("/window/create", formData);

    request
      .then((res) => {
        notifications.show({
          message: defaultData
            ? "Window is updated successfully"
            : "Window is created successfully",
          color: "blue",
        });
        dispatch({
          type: defaultData ? UPDATE_WINDOW_SUCCESS : ADD_WINDOW_SUCCESS,
          payload: res.data?.data.data,
        });
        setFormData({
          title: "",
          description: "",
        });
        closeAddEditWindow();
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage = err.response.data.message;

          if (errorMessage && errorMessage.includes("duplicate key")) {
            notifications.show({
              message: `Failed to ${
                defaultData ? "update" : "create"
              } window. It seems a window with similar details already exists.`,
              color: "red",
            });
          } else {
            notifications.show({
              message:
                errorMessage ??
                `Failed to ${
                  defaultData.title ? "update" : "create"
                } window! Please try again.`,
              color: "red",
            });
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddEditWindow}
      onClose={closeAddEditWindow}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[100vw] md:w-[55vw] lg:w-[40vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl p-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEditWindow}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Update Window" : "Create New Window"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            {defaultData
              ? "Update your Window details."
              : "Provide your Window details to create a new Window."}
          </h2>
        </div>
        <div className=" w-full  flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-2 px-2"
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="WindowTitle"
                  className="block text-lg font-bold text-gray-700"
                >
                  Title
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <Folder2 />
                  </span>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Window title"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
            </div>

            <div className="">
              <label
                htmlFor="description"
                className="block text-lg font-bold text-gray-700"
              >
                Description
              </label>
              <div className="w-full relative">
                <span className="absolute left-2 top-[10px]">
                  <Subtitles />
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Add description"
                  onChange={handleChange}
                  className="mt-1 block w-full pb-28 pt-2 pl-8 px-3  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddEditWindow}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Loading..." : defaultData ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditWindow;
