import { Modal, TextInput, Button, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Folder2, Subtitles } from "solar-icon-set";
import { IoMdClose } from "react-icons/io";

interface NewRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewRoleModal = ({ isOpen, onClose }: NewRoleModalProps) => {
    const form = useForm({
        initialValues: {
            Role: "",
            email: "",
        },
    });

    const handleSubmit = (values: any) => {
        console.log("Form submitted:", values);
        // You can replace the console.log with an API call or another action
        onClose(); // Close the modal after submission
    };

    return (
        <Modal
            size={"auto"}
            withCloseButton={false}
            opened={isOpen}
            onClose={onClose}
        >
            <div className="w-[750px] h-fit relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
                <button
                    className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                    onClick={onClose}
                >
                    <IoMdClose size={25} color={"#000"} />
                </button>
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-2xl font-extrabold">
                        Create New Sector
                    </h1>
                    <h2 className="text-[#000F2369] text-lg font-medium">
                        Provide your sector details to create a new sector.
                    </h2>
                </div>
                <div className="w-fit flex flex-col items-center mt-10 overflow-hidden">
                    <form
                        onSubmit={form.onSubmit(handleSubmit)}
                        className="w-full overflow-y-auto flex flex-col gap-4 px-2"
                    >
                        <div className="w-full flex justify-between gap-3">
                            <div className="w-full">
                                <label
                                    htmlFor="title"
                                    className="block text-lg font-bold text-gray-700"
                                >
                                    Title
                                </label>
                                <div className="w-full relative">
                                    <span className="absolute left-2 top-[10px]">
                                        <Folder2 />
                                    </span>
                                    <TextInput
                                        name="title"
                                        placeholder="Sector title"
                                        {...form.getInputProps("title")}
                                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <label
                                htmlFor="description"
                                className="block text-lg font-bold text-gray-700"
                            >
                                Email
                            </label>
                            <div className="w-full relative">
                                <span className="absolute left-2 ">
                                    <Subtitles />
                                </span>
                                <TextInput
                                    name="description"
                                    placeholder="Add description"
                                    {...form.getInputProps("email")}
                                    className="mt-1 block w-full   pl-8 px-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                    required
                                />
                            </div>
                        </div>
                        <label
                            htmlFor="tabs"
                            className="block text-lg font-bold text-gray-700 mt-6"
                        >
                            Assign Tabs
                        </label>
                        <div>
                            <MultiSelect
                                name="sectors"
                                data={[
                                    { value: "Trades", label: "Trades" },
                                    {
                                        value: "Applicants",
                                        label: "Applicants",
                                    },
                                    {
                                        value: "Application Reports",
                                        label: "Application Reports",
                                    },
                                    {
                                        value: "Notifications",
                                        label: "Notifications",
                                    },
                                    { value: "Employees", label: "Employees" },
                                    {
                                        value: "Reports",
                                        label: "Reports",
                                    },
                                    {
                                        value: "MandE Reports",
                                        label: "MandE Reports",
                                    },
                                    {
                                        value: "Profile",
                                        label: "Profile",
                                    }
                                ]}
                                className="mt-4"
                                placeholder="Select tabs..."
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 bg-primary text-white py-6 px-4  rounded-full"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default NewRoleModal;
