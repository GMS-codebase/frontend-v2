import {
  ADD_SECTOR_SUCCESS,
  UPDATE_SECTOR_SUCCESS,
} from "@/actions/SectorsActions";
import { authorizedApi } from "@/utils/api";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Folder2, Subtitles } from "solar-icon-set";

interface AddEditSectorProps {
  isOpenAddEditSector: boolean;
  closeAddEditSector: () => void;
  defaultData?: any;
}

const AddEditSector = ({
  isOpenAddEditSector,
  closeAddEditSector,
  defaultData,
}: AddEditSectorProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortname: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    shortname: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (defaultData) {
      setFormData({
        name: defaultData.name || "",
        description: defaultData.description || "",
        shortname: defaultData.shortname || "",
      });
    }
  }, [defaultData]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      shortname: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Title is required.";
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
      ? authorizedApi.put(`/Sectors/${defaultData.uuid}`, formData)
      : authorizedApi.post("/Sectors", formData);

    request
      .then((res) => {
        notifications.show({
          message: defaultData
            ? "Sector is updated successfully"
            : "Sector is created successfully",
          color: "blue",
        });

        dispatch({
          type: defaultData ? UPDATE_SECTOR_SUCCESS : ADD_SECTOR_SUCCESS,
          payload: res.data?.data?.data,
        });
        setFormData({
          name: "",
          description: "",
          shortname: "",
        });
        closeAddEditSector();
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
                  defaultData.name ? "update" : "create"
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
      opened={isOpenAddEditSector}
      onClose={closeAddEditSector}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="lg:w-[45vw] w-full max-h-[90vh] overflow-y-auto modal relative bg-white rounded-3xl p-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEditSector}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Update Sector" : "Create New Sector"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            {defaultData
              ? "Update your Sector details."
              : "Provide your Sector details to create a new Sector."}
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
                  htmlFor="SectorTitle"
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
                    name="name"
                    value={formData.name}
                    placeholder="Sector name"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="SectorShortname"
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
                    placeholder="Sector Shortname"
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
                  className="mt-1 block w-full pb-28  pt-2 pl-8 px-3  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddEditSector}
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

export default AddEditSector;
