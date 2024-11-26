import { Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import AuthService from "@/services/auth";
import { notifications } from "@mantine/notifications";

const RegisterModal = ({
  isOpenRegister,
  closeRegister,
  openLogin,
  openSuccess,
}: {
  isOpenRegister: boolean;
  closeRegister: () => void;
  openLogin: () => void;
  openSuccess: () => void;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    gender: "",
    institution: "",
    position: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    gender: "",
    institution: "",
    position: "",
  });

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.firstname) {
      newErrors.firstname = "First name is required";
      valid = false;
    } else {
      newErrors.firstname = "";
    }

    if (!formData.lastname) {
      newErrors.lastname = "Last name is required";
      valid = false;
    } else {
      newErrors.lastname = "";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    } else {
      newErrors.email = "";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phonenumber || !phoneRegex.test(formData.phonenumber)) {
      newErrors.phonenumber = "Invalid phone number";
      valid = false;
    } else {
      newErrors.phonenumber = "";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    } else {
      newErrors.gender = "";
    }
    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.institution) {
      newErrors.institution = "Institution name is required";
      valid = false;
    } else {
      newErrors.institution = "";
    }

    if (!formData.position) {
      newErrors.position = "Position is required";
      valid = false;
    } else {
      newErrors.position = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleChange = (e: { target: { name: any; value: any } }) => {
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (active === 0 && validateStep1()) {
      setActive((current) => (current < 1 ? current + 1 : current));
    } else if (active === 1 && validateStep2()) {
      setLoading(true);
      await AuthService.signup(formData, () => {
        closeRegister();
        openSuccess();
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenRegister}
      onClose={closeRegister}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] max-h-[90vh] py-10  relative bg-white rounded-3xl p-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeRegister}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1}
          alt="vector"
          className="absolute top-[3rem] right-[-4rem]"
          width={100}
          height={50}
        />
        <Image
          src={SideVector2}
          alt="vector"
          className="absolute bottom-[3rem] left-[-4rem]"
          width={100}
          height={50}
        />
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Register</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your details to register your account.
          </h2>
        </div>

        <div className="w-full px-10  flex flex-col items-center mt-4 overflow-hidden ">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            <Stepper.Step
              label="Applicant Info"
              description=""
              className="text-xs"
            >
              <div className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2">
                <div className="w-full">
                  <label
                    htmlFor="institution"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Institution Name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      placeholder="Type in institution name"
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.institution ? "border-red-500" : ""
                      }`}
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-xs">
                        {errors.institution}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="institution"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Position
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      placeholder="Type in position name"
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.position ? "border-red-500" : ""
                      }`}
                    />
                    {errors.position && (
                      <p className="text-red-500 text-xs">{errors.position}</p>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) {
                        setActive(1);
                      }
                    }}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>
            <Stepper.Step
              label="Contact Person"
              description=""
              className="text-xs"
            >
              <form
                onSubmit={handleSubmit}
                className="w-full  overflow-y-auto flex flex-col gap-2 px-2"
              >
                <div className="space-y-1">
                  <div className="w-full flex justify-between gap-3">
                    <div className="w-full">
                      <label
                        htmlFor="firstname"
                        className="block text-xs font-bold text-gray-700"
                      >
                        First name
                      </label>
                      <div className="w-full relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">
                          <BsPerson className="w-5 h-5" />
                        </span>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          placeholder="Type in your first name"
                          onChange={handleChange}
                          className={`mt-1 block w-full pl-10 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errors.firstname ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="lastname"
                        className="block text-xs font-bold text-gray-700"
                      >
                        Last Name
                      </label>
                      <div className="w-full relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">
                          <BsPerson className="h-5 2-5" />
                        </span>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          placeholder="Type in your last name"
                          onChange={handleChange}
                          className={`mt-1 block w-full pl-8 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errors.lastname ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  {(errors.firstname || errors.lastname) && (
                    <p className="text-red-500 text-xs">
                      {errors.firstname || errors.lastname}
                    </p>
                  )}
                </div>

                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Email
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      placeholder="Type in your email"
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-8 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                <div className="">
                  <label
                    htmlFor="phonenumber"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative mt-1 rounded-full">
                    <div className="absolute  left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        <MdPhoneAndroid color="#000" className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="absolute left-8 top-1 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                      <span className="text-gray-500 text-sm ml-2">+250</span>
                    </div>
                    <input
                      type="text"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="Type in your phone"
                      className={`block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.phonenumber ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.phonenumber && (
                    <p className="text-red-500 text-xs">{errors.phonenumber}</p>
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
                      errors.gender &&
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          gender: "",
                        }));
                    }}
                    data={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                    placeholder="Select your gender"
                    className={`mt-1 block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none sm:text-sm ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-xs">{errors.gender}</p>
                  )}
                </div>

                <div className="w-full flex flex-col justify-center mt-4 gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? "Loading..." : "Sign Up"}
                  </button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#005DE916] text-blue-700 font-bold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Go Back
                  </button>
                </div>
                <h1 className="w-full text-center text-[#000F2369] text-base font-medium mt-4">
                  Already have an account?{" "}
                  <span
                    className="text-base font-medium cursor-pointer text-primary"
                    onClick={() => {
                      closeRegister();
                      openLogin();
                    }}
                  >
                    Login
                  </span>
                </h1>
              </form>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
