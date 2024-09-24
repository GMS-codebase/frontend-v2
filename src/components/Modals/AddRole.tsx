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
        userInputs: string[];  // For dynamically added users
        tabInputs: string[];   // For dynamically added tabs
    }>({
        roleTitle: "",
        permissions: [],
        users: [],
        userInputs: [""],    // Start with one user input
        tabInputs: [""],     // Start with one tab input
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: 'users' | 'tabs') => {
        const { value } = e.target;
        setFormData((prevData) => {
            const updatedInputs = type === 'users' ? [...prevData.userInputs] : [...prevData.tabInputs];
            updatedInputs[index] = value;
            return {
                ...prevData,
                [type === 'users' ? 'userInputs' : 'tabInputs']: updatedInputs,
            };
        });
    };

    const addNewInput = (type: 'users' | 'tabs') => {
        setFormData((prevData) => ({
            ...prevData,
            [type === 'users' ? 'userInputs' : 'tabInputs']: [
                ...(type === 'users' ? prevData.userInputs : prevData.tabInputs), 
                "" // Add an empty string for the new input
            ],
        }));
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    const handleCancel = () => {
        closeAddEditRole();
    };

    const MultiSelectPermissionsData = [
        { value: "Permission 1", label: "Permission 1" },
        { value: "Permission 2", label: "Permission 2" },
        { value: "Permission 3", label: "Permission 3" },
    ];

    return (
        <Modal
            opened={isOpenAddEditRole}
            onClose={handleCancel}
            closeOnClickOutside={false}
            withCloseButton={false}
            size="lg"
        >
            <div className="w-full flex flex-col gap-2 p-8 bg-white rounded-3xl ">
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

                {/* Role Title */}
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
                        onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                        placeholder="Role Title"
                        className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm"
                    />
                </div>

                {/* Permissions/Tabs Section */}
                <div className="w-full flex flex-col gap-2 my-4 relative">
                    <label className="block text-base font-medium text-black">
                        Permissions/Tabs
                    </label>
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
                        className="w-full bg-[#000F230A] rounded-2xl"
                    />
                    {formData.tabInputs.map((tabInput, index) => (
                        <div key={index} className="relative w-full mt-2">
                            <input
                                type="text"
                                value={tabInput}
                                onChange={(e) => handleChange(e, index, 'tabs')}
                                placeholder={`Tab ${index + 1}`}
                                className="block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm pr-24" // Add padding-right to make space for the button
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2 bg-blue-500 text-white px-2 rounded-full h-8"
                                onClick={() => addNewInput('tabs')}
                            >
                                Add Tab
                            </button>
                        </div>
                    ))}
                </div>

                {/* Users Section */}
                <div className="w-full flex flex-col gap-2 my-4 relative">
                    <label className="block text-base font-medium text-black">
                        Users
                    </label>
                    {formData.userInputs.map((userInput, index) => (
                        <div key={index} className="relative w-full mt-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => handleChange(e, index, 'users')}
                                placeholder={`User ${index + 1}`}
                                className="block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm pr-24" // Add padding-right to make space for the button
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2 bg-blue-500 text-white px-2 rounded-full h-8"
                                onClick={() => addNewInput('users')}
                            >
                                Add User
                            </button>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="w-full flex justify-between gap-3 mt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full px-4 py-3 bg-black text-white rounded-full"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-full"
                    >
                        Create
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddRoleModal;
