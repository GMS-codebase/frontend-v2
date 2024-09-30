import { Modal, MultiSelect } from "@mantine/core";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Input, Pill, Stack, Box, Text } from "@mantine/core";
import { isEmail } from "@mantine/form";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { ADD_ROLE_SUCCESS } from "@/actions/RolesActions";
import { getRoles } from "@/utils/funcs";
interface AddRoleModalProps {
  isOpenAddEditRole: boolean;
  closeAddEditRole: () => void;
  initialData: any;
}

const EditRoleModal: React.FC<AddRoleModalProps> = ({
  isOpenAddEditRole,
  closeAddEditRole,
  initialData,
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    tabs: string[];
    emails: string[];
  }>({
    title: "",
    tabs: [],
    emails: [],
  });
  useEffect(() => {
    const tabs = initialData?.users[0]?.tabs ?? [];
    const emails =
      initialData?.users?.map((user: any) => {
        return user.email;
      }) ?? [];
    if (initialData) {
      setFormData({ title: initialData?.title, tabs: tabs, emails: emails });
    }
  }, [initialData]);
  console.log("initial data", initialData);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MultiSelectPermissionsData = [
    { value: "Dashboard", label: "Dashboard" },
    { value: "Calls", label: "Calls" },
    { value: "Windows", label: "Windows" },
    { value: "Sectors", label: "Sectors" },
    { value: "Trades", label: "Trades" },
    { value: "Applicants", label: "Applicants" },
    { value: "Applications", label: "Applications" },
    { value: "Application Reports", label: "Application Reports" },
    { value: "Reports", label: "Reports" },
    { value: "Notifications", label: "Notifications" },
    { value: "Employees", label: "Employees" },
    { value: "Roles", label: "Roles" },
    { value: "M&E Reports", label: "M&E Reports" },
    { value: "Profile", label: "Profile" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({
      ...prevData,
      [name]: null,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    authorizedApi
      .patch(`/roles/update-role/${initialData.uuid}`, formData)
      .then((res) => {
        getRoles(dispatch);
        console.log(res.data);
        notifications.show({
          message: "Role updated successfully",
          color: "blue",
        });
        closeAddEditRole();
      })
      .catch((err) => {
        console.log(err.response);
        notifications.show({
          title: "Failed to update role",
          message: err.response.data.message ?? "",
          color: "red",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleCancel = () => {
    closeAddEditRole();
  };
  return (
    <Modal
      opened={isOpenAddEditRole}
      onClose={handleCancel}
      closeOnClickOutside={false}
      withCloseButton={false}
      size="lg"
      styles={{
        content: {
          backgroundColor: "#ffffff",
          borderRadius: "10px",
        },
        header: {
          borderBottom: "none",
        },
      }}
    >
      <div className="w-full flex flex-col gap-2 p-8 bg-white rounded-3xl ">
        <div className="">
          <button
            className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
            onClick={handleCancel}
          >
            <IoMdClose size={25} color={"#000"} />
          </button>
          <h1 className="text-2xl font-extrabold">Edit Role</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the new role details to update this role.
          </h2>
          <div className="w-full">
            <label
              htmlFor="title"
              className="block text-base font-medium text-black"
            >
              Role Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Role Title"
              className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 my-4">
            <label
              htmlFor="permissions"
              className="block text-base font-medium text-black"
            >
              Permissions/tabs
            </label>
            <div className="w-full">
              <MultiSelect
                value={formData.tabs}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    tabs: value,
                  }))
                }
                data={MultiSelectPermissionsData}
                placeholder="Select permissions"
                searchable
                clearable
                className="bg-[#000F230A] rounded-2xl"
              />
              {errors.tabs && (
                <p className="text-red-600 text-sm mt-1">{errors.tabs}</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditRoleModal;
