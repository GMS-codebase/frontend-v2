import {
  Modal,
  MultiSelect,
  Select,
  Stepper,
  TextInput,
  Button,
} from "@mantine/core";
import { FormEvent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import {
  SolarSuitcaseLinear,
  SolarWindowFrameLinear,
  SolarUploadBold,
} from "../../core/icons";
import { CalendarMinimalistic } from "solar-icon-set";
import { ShieldWarning } from "solar-icon-set";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ADD_CONTACT_SUCCESS } from "@/actions/ContactsActions";
import { useDispatch } from "react-redux";

const AddEditContact = ({
  isOpenAddEditContact,
  closeAddEditContact,
  defaultData,
}: {
  isOpenAddEditContact: boolean;
  closeAddEditContact: () => void;
  defaultData?: {
    id: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone1?: string;
    phone2?: string;
    gender?: string;
    institutionName?: string;
    position?: string;
  };
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: defaultData?.firstname || "",
    lastname: defaultData?.lastname || "",
    email: defaultData?.email || "",
    phone1: defaultData?.phone1 || "",
    phone2: defaultData?.phone2 || "",
    gender: defaultData?.gender || "",
    position: defaultData?.position || "",
  });
  const [errors, setErrors] = useState({
    firstname: defaultData?.firstname || "",
    lastname: defaultData?.lastname || "",
    email: defaultData?.email || "",
    phone1: defaultData?.phone1 || "",
    phone2: defaultData?.phone1 || "",
    gender: defaultData?.gender || "",
    position: defaultData?.position || "",
  });

  const validateStep = () => {
    const stepErrors: any = {};

    if (active === 0) {
      if (!formData.firstname) stepErrors.firstname = "First name is required.";
      if (!formData.lastname) stepErrors.lastname = "Last name is required.";
      if (!formData.email) stepErrors.email = "Email is required.";
      if (!formData.gender) stepErrors.gender = "Gender is required.";
    } else if (active === 1) {
      if (!formData.phone1)
        stepErrors.phone1 = "At least one phone number is required.";
      if (!formData.position) stepErrors.position = "Position is required.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    //@ts-ignore
    errors[name] &&
      setErrors((prevData) => ({
        ...prevData,
        [name]: "",
      }));
  };
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (validateStep()) {
      try {
        let res;
        if (defaultData) {
          res = await authorizedApi.put(
            `/contacts/${defaultData.id}`,
            formData
          );
        } else {
          res = await authorizedApi.post("/contacts", formData);
        }
        notifications.show({
          message: "Contact is created successfully",
          color: "blue",
        });
        dispatch({
          type: ADD_CONTACT_SUCCESS,
          payload: res.data?.data,
        });
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone1: "",
          phone2: "",
          gender: "",
          position: "",
        });
        closeAddEditContact();
      } catch (error: any) {
        console.error("Failed to save contact:", error);
        notifications.show({
          message: error.response?.data?.message ?? "Failed to create call!",
          color: "red",
        });
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      size="lg"
      opened={isOpenAddEditContact}
      onClose={closeAddEditContact}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[600px] h-fit relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddEditContact}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Edit Contact" : "Add Contact"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            {defaultData
              ? "Update the contact details."
              : "Provide the contact details to create a new contact."}
          </h2>
        </div>
        <div className="w-full  flex flex-col items-center px-10 m-4 overflow-hidden">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            <Stepper.Step
              label="Contact Person"
              description=""
              className="text-xs"
            >
              <div className="w-full pb-5  overflow-y-auto flex flex-col gap-2 px-2">
                <div className="w-full flex justify-between gap-3">
                  <div className="w-full">
                    <label
                      htmlFor="firstname"
                      className="block text-xs font-bold text-gray-700"
                    >
                      First name
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <BsPerson />
                      </span>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        placeholder="Type in your first name"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {errors.firstname && (
                      <p className="text-red-500 text-sm">{errors.firstname}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="lastname"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Last Name
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <BsPerson />
                      </span>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        placeholder="Type in your last name"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {errors.lastname && (
                      <p className="text-red-500 text-sm">{errors.lastname}</p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Email
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      placeholder="Type in your email"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="gender"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Gender
                  </label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={(value: any) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        gender: value,
                      }));
                      //@ts-ignore
                      errors.gender &&
                        setErrors((prevData) => ({
                          ...prevData,
                          gender: "",
                        }));
                    }}
                    data={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                    placeholder="Select your gender"
                    className="mt-1 block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none sm:text-sm"
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>
                <div className="w-full flex justify-center mt-4 gap-4 font-bold">
                  <button
                    onClick={closeAddEditContact}
                    type="button"
                    className="w-full px-4 py-2 bg-primaryText text-white rounded-full shadow-sm outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full px-4 py-2 bg-primary text-white rounded-full shadow-sm outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>
            <Stepper.Step
              label="Applicant Info"
              description=""
              className="text-xs"
            >
              <form
                onSubmit={handleSubmit}
                className="w-full pb-10   gap-2 px-2"
              >
                <div className="">
                  <label
                    htmlFor="phone1"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative mt-1 rounded-full">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        <MdPhoneAndroid color="#000" size={21} />
                      </span>
                    </div>
                    <div className="absolute left-7 top-1 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                      <span className="text-gray-500 text-sm ml-2">+250</span>
                    </div>
                    <input
                      type="text"
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleChange}
                      placeholder="Type in your phone"
                      className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="phone2"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Phone Number 2{" "}
                    <span className="text-[10px]">(optional)</span>
                  </label>
                  <div className="relative mt-1 rounded-full">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        <MdPhoneAndroid color="#000" size={21} />
                      </span>
                    </div>
                    <div className="absolute left-7 top-1 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                      <span className="text-gray-500 text-sm ml-2">+250</span>
                    </div>
                    <input
                      type="text"
                      name="phone2"
                      value={formData.phone2}
                      onChange={handleChange}
                      placeholder="Type in  phone"
                      className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.phone1 && (
                    <p className="text-red-500 text-sm">{errors.phone1}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="position"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Position
                  </label>
                  <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <Select
                      name="position"
                      value={formData.position}
                      onChange={(value: any) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          position: value,
                        }));
                        //@ts-ignore
                        errors.position &&
                          setErrors((prevData) => ({
                            ...prevData,
                            position: "",
                          }));
                      }}
                      data={[
                        { value: "CEO", label: "CEO" },
                        { value: "CTO", label: "CTO" },
                        {
                          value: "Marketing Manager",
                          label: "Marketing Manager",
                        },
                      ]}
                      placeholder="Select your position"
                    />
                  </div>
                  {errors.position && (
                    <p className="text-red-500 text-sm">{errors.position}</p>
                  )}
                </div>
                <div className="w-full flex justify-center mt-4 gap-4 font-bold">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="w-full px-4 py-2 bg-primaryText text-white rounded-full shadow-sm outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-white rounded-full shadow-sm outline-none"
                  >
                    {loading ? "Loading..." : defaultData ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditContact;
