import { Modal, MultiSelect } from "@mantine/core";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

interface AddRoleModalProps {
    isOpenAddEditRole: boolean;
    closeAddEditRole: () => void;
    initialData?: {
        roleTitle: string;
        permissions: string[];
    };
    onSubmit: (data: {
        roleTitle: string;
        permissions: string[];
    }) => Promise<void>;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
    isOpenAddEditRole,
    closeAddEditRole,
    initialData,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<{
        roleTitle: string;
        permissions: string[];
    }>({
        roleTitle: "",
        permissions: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate formData with initialData when the modal opens for editing
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset form when there's no initialData
            setFormData({
                roleTitle: "",
                permissions: [],
            });
        }
    }, [initialData, isOpenAddEditRole]);

    const MultiSelectPermissionsData = [
        { value: "Permission 1", label: "Permission 1" },
        { value: "Permission 2", label: "Permission 2" },
        { value: "Permission 3", label: "Permission 3" },
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(formData); // Ensure form submission completes before closing modal
            closeAddEditRole();
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
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
                header: {
                    borderBottom: "none",
                },
            }}
        >
            <div className="w-full flex flex-col gap-2 p-8 bg-white rounded-3xl">
                <div className="">
                    <button
                        className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                        onClick={handleCancel}
                    >
                        <IoMdClose size={25} color={"#000"} />
                    </button>
                    <h1 className="text-2xl font-extrabold">
                        {initialData ? "Edit Role" : "Add Role"}
                    </h1>
                    <h2 className="text-[#000F2369] text-lg font-medium">
                        Provide the role details to{" "}
                        {initialData ? "update" : "create"} a new role.
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
                            Permissions
                        </label>
                        <div className="w-full">
                            <MultiSelect
                                value={[]}
                                onChange={(value) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        permissions: value,
                                    }))
                                }
                                data={[]}
                                placeholder="Select permissions"
                                searchable
                                clearable
                                className="bg-[#000F230A] rounded-2xl"
                            />
                            {errors?.permissions && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.permissions}
                                </p>
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
                            {isSubmitting
                                ? "Processing..."
                                : initialData
                                ? "Update"
                                : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddRoleModal;
