import { Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Input, Pill, Stack, Box, Text } from "@mantine/core";
import { isEmail } from "@mantine/form";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { ADD_ROLE_SUCCESS } from "@/actions/RolesActions";
import { getRoles } from "@/utils/funcs";
interface AddRoleModalProps {
  isOpenAddRoleUser: boolean;
  closeAddRoleUser: () => void;
  role: string;
}

const AddRoleUser: React.FC<AddRoleModalProps> = ({
  isOpenAddRoleUser,
  closeAddRoleUser,
  role,
}) => {
  const [formData, setFormData] = useState<{
    email: string;
  }>({
    email: "",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    authorizedApi
      .patch(`/roles/add-new-user/${role}`, formData)
      .then((res) => {
        getRoles(dispatch);

        notifications.show({
          message: "User added successfully",
          color: "blue",
        });
        closeAddRoleUser();
      })
      .catch((err) => {

        notifications.show({
          title: "Failed to add role",
          message: err.response.data.message ?? "",
          color: "red",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleCancel = () => {
    closeAddRoleUser();
  };

  return (
    <Modal
      opened={isOpenAddRoleUser}
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
          <h1 className="text-2xl font-extrabold">Add Role</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the role details to create a new role.
          </h2>

          <div className="w-full">
            <label
              htmlFor="title"
              className="block text-base font-medium text-black"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={(e: any) => setFormData({ email: e.target.value })}
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
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
            {isSubmitting ? "Processing..." : "Add User"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRoleUser;
