import { Modal, TextInput, Button, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Folder2, Subtitles } from "solar-icon-set";
import { IoMdClose } from "react-icons/io";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

interface NewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewRoleModal = ({ isOpen, onClose }: NewRoleModalProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<any>({
    initialValues: {
      title: "",
      email: "",
      tabs: [],
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await authorizedApi.post(
        "/admin/create-dynamic-user",
        form.values,
      );
      console.log("Form submitted:", response.data);
      notifications.show({
        message:
          "User created successfully! Email Is sent to the user for more steps",
        color: "blue",
      });
      form.setValues({ title: "", email: "", tabs: [] });
      form.setValues({ title: "", email: "", tabs: [] });
      onClose();
    } catch (err: any) {
      console.log(err.response);
      notifications.show({
        message: err.response?.data?.message ?? "Failed to create user!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"lg"}
      withCloseButton={false}
      opened={isOpen}
      onClose={onClose}
    >
      <div className="w-full h-fit relative bg-white rounded-3xl pt-10 pb-6 px-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Create A Dynamic User</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the required data for the dynamic user.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-10 overflow-hidden">
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
                  <span className="absolute left-2 inset-y-4">
                    <Folder2 />
                  </span>
                  <TextInput
                    name="title"
                    placeholder="Title"
                    {...form.getInputProps("title")}
                    className="mt-1 block w-full pl-10 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block text-lg font-bold text-gray-700"
              >
                Email
              </label>
              <div className="w-full relative">
                <span className="absolute left-2 inset-y-4">
                  <Subtitles />
                </span>
                <TextInput
                  name="email"
                  placeholder="Email"
                  {...form.getInputProps("email")}
                  className="mt-1 block w-full pl-10 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  required
                />
              </div>
            </div>
            <label
              htmlFor="tabs"
              className="block text-lg font-bold text-gray-700"
            >
              Assign Tabs
            </label>
            <div>
              <MultiSelect
                name="tabs"
                data={[
                  { value: "Trades", label: "Trades" },
                  { value: "Applicants", label: "Applicants" },
                  {
                    value: "Application Reports",
                    label: "Application Reports",
                  },
                  { value: "Notifications", label: "Notifications" },
                  { value: "Employees", label: "Employees" },
                  { value: "Reports", label: "Reports" },
                  { value: "MandE Reports", label: "MandE Reports" },
                  { value: "Profile", label: "Profile" },
                ]}
                value={form.getInputProps("tabs").value}
                onChange={(value) => form.setFieldValue("tabs", value)}
                className="mt-1 block w-full py-2 pl-1 px-3 bg-[#000F230A] rounded-2xl shadow-sm"
                placeholder="Select tabs..."
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-primary text-white py-3 px-4 rounded-full"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default NewRoleModal;
