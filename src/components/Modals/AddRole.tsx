import { Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface AddRoleModalProps {
    isOpenAddEditRole: boolean;
    closeAddEditRole: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
    isOpenAddEditRole,
    closeAddEditRole,
}) => {
    const [formData, setFormData] = useState<{
        roleTitle: string;
        permissions: string[];
        users: string[];
    }>({
        roleTitle: "",
        permissions: [],
        users: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MultiSelectPermissionsData = [
        { value: "Permission 1", label: "Permission 1" },
        { value: "Permission 2", label: "Permission 2" },
        { value: "Permission 3", label: "Permission 3" },
    ];

    const MultiSelectUsersData = [
        { value: "User 1", label: "User 1" },
        { value: "User 2", label: "User 2" },
        { value: "User 3", label: "User 3" },
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
        // Handle form submission logic here
        console.log(formData);
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
                            htmlFor="roleTitle"
                            className="block text-base font-medium text-black"
                        >
                            Role Title
                        </label>
                        <input
                            type="text"
                            name="roleTitle"
                            value={formData.roleTitle}
                            onChange={handleChange}
                            placeholder="Role Title"
                            className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        />
                        {errors.roleTitle && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.roleTitle}
                            </p>
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
                                value={formData.permissions}
                                onChange={(value) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        permissions: value,
                                    }))
                                }
                                data={MultiSelectPermissionsData}
                                placeholder="Select permissions"
                                searchable
                                clearable
                                className="bg-[#000F230A] rounded-2xl"
                            />
                            {errors.permissions && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.permissions}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2 my-4">
                        <label
                            htmlFor="users"
                            className="block text-base font-medium text-black"
                        >
                            Users
                        </label>
                        
                            <div className="w-full">
                                <MultiSelect
                                    value={formData.users}
                                    onChange={(value) =>
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            users: value,
                                        }))
                                    }
                                    data={MultiSelectUsersData}
                                    placeholder="Select users"
                                    searchable
                                    clearable
                                    className="bg-[#000F230A] rounded-2xl"
                                />
                                {errors.users && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.users}
                                    </p>
                                )}
                            </div>
                            {/* <div className="w-full flex justify-end my-5 space-x-4">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add New Sector
                                </button>
                            </div> */}
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
