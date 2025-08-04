import { Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Input, Pill, Stack, Box, Text } from "@mantine/core";
import { isEmail } from "@mantine/form";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { ADD_ROLE_SUCCESS } from "@/actions/RolesActions";
import { getRoles } from "@/services";
interface AddRoleModalProps {
  isOpenAddEditRole: boolean;
  closeAddEditRole: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpenAddEditRole,
  closeAddEditRole,
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
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState<any>([]);
  const [emailInput, setEmailInput] = useState<any>("");
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && emailInput.trim() !== "") {
      if (isEmail(emailInput)) {
        setFormData({ ...formData, emails: [...formData.emails, emailInput] });
        setEmailInput("");
      } else {
        alert("Please enter a valid email");
      }
      event.preventDefault();
    }
  };
  const removeEmail = (emailToRemove: any) => {
    setFormData({
      ...formData,
      emails: [
        ...formData.emails.filter((email: string) => email !== emailToRemove),
      ],
    });
  };

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
      .post("/roles/create-role", formData)
      .then((res) => {
        getRoles(dispatch);

        notifications.show({
          message: "Role created successfully",
          color: "blue",
        });
        closeAddEditRole();
      })
      .catch((err) => {
        notifications.show({
          title: "Failed to create role",
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
          backgroundColor: "#ffffff", // Set the modal background to white
          borderRadius: "10px", // Optional: add border radius
        },
        header: {
          borderBottom: "none", // Optional: remove header border
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
          <h1 className="text-2xl font-extrabold">Add Role</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the role details to create a new role.
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

          <div className="w-full flex flex-col gap-2 my-4">
            <label
              htmlFor="emails"
              className="block text-base font-medium text-black"
            >
              Users
            </label>

            <div className="w-full">
              <Input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Type an email and press Enter"
                onKeyDown={handleKeyDown}
              />
              <Stack mt="sm">
                {formData.emails.length > 0 ? (
                  formData.emails.map((email: string) => (
                    <Box key={email}>
                      <Pill
                        withRemoveButton
                        onRemove={() => removeEmail(email)}
                        color="blue"
                        radius="xl"
                        size="md"
                      >
                        {email}
                      </Pill>
                    </Box>
                  ))
                ) : (
                  <Text size="sm">No emails added yet</Text>
                )}
              </Stack>
            </div>
            {errors.emails && (
              <p className="text-red-600 text-sm mt-1">{errors.emails}</p>
            )}
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
            {isSubmitting ? "Processing..." : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRoleModal;
