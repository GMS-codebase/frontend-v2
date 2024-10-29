import {
  ADD_TRADE_SUCCESS,
  UPDATE_TRADE_SUCCESS,
} from "@/actions/TradesActions";
import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Folder2, Subtitles } from "solar-icon-set";

interface AddEditTradeProps {
  isOpenAddEditTrade: boolean;
  closeAddEditTrade: () => void;
  defaultData?: any;
}

const AddEditTrade = ({
  isOpenAddEditTrade,
  closeAddEditTrade,
  defaultData,
}: AddEditTradeProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortname: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    shortname: "",
  });

  const dispatch = useDispatch();

  // Use useEffect to pre-fill the form if defaultData is provided
  useEffect(() => {
    if (defaultData) {
      setFormData({
        title: defaultData.title || "",
        description: defaultData.description || "",
        shortname: defaultData.shortname || "",
      });
    }
  }, [defaultData]);

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      shortname: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!formData.shortname.trim()) {
      newErrors.shortname = "Shortname is required.";
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
      ? authorizedApi.put(`/trade/${defaultData.uuid}`, formData)
      : authorizedApi.post("/trade", formData);

    request
      .then((res) => {
        notifications.show({
          message: defaultData
            ? "Trade is updated successfully"
            : "Trade is created successfully",
          color: "blue",
        });

        dispatch({
          type: defaultData ? UPDATE_TRADE_SUCCESS : ADD_TRADE_SUCCESS,
          payload: res.data?.data,
        });
        setFormData({
          title: "",
          description: "",
          shortname: "",
        });
        closeAddEditTrade();
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage = err.response.data.message;
          if (errorMessage && errorMessage.includes("duplicate key")) {
            notifications.show({
              message: `Failed to ${
                defaultData ? "update" : "create"
              } trade. It seems a trade with similar details already exists.`,
              color: "red",
            });
          } else {
            notifications.show({
              message:
                errorMessage ??
                `Failed to ${
                  defaultData.title ? "update" : "create"
                } trade! Please try again.`,
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
      opened={isOpenAddEditTrade}
      onClose={closeAddEditTrade}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh] overflow-y-auto  relative bg-white rounded-3xl p-16 flex flex-col items-center modal">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEditTrade}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Update Trade" : "Create New Trade"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            {defaultData
              ? "Update your Trade details."
              : "Provide your Trade details to create a new Trade."}
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-10 ">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-2 px-2"
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="TradeTitle"
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
                    placeholder="Trade title"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="TradeShortname"
                  className="block text-lg font-bold text-gray-700"
                >
                  Shortname
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <Folder2 />
                  </span>
                  <input
                    type="text"
                    name="shortname"
                    value={formData.shortname}
                    placeholder="Trade Shortname"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
                {errors.shortname && (
                  <p className="text-red-500 text-sm">{errors.shortname}</p>
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
                onClick={closeAddEditTrade}
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

export default AddEditTrade;
