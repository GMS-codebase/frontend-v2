import { Checkbox, Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { notifications } from "@mantine/notifications";
import {
  PhGenderIntersex,
  SolarIphoneLinear,
  SolarLetterLinear,
  SolarSuitcaseLinear,
  SolarUserBroken,
} from "../core/icons";
import { authorizedApi } from "@/utils/api";
import { ADD_EMPLOYEE_SUCCESS } from "@/actions/EmployeesActions";
import { useDispatch } from "react-redux";

const RegisterModal = ({
  isOpenAddEmployee,
  closeAddEmployee,
  refetch,
}: {
  isOpenAddEmployee: boolean;
  closeAddEmployee: () => void;
  refetch: () => void;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    institution: "",
    position: "",
    name: "",
    isInternal: false,
    employee: "",
    nationalId: "",
    employeeRole: "EMPLOYEE",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    institution: "",
    position: "",
    name: "",
    isInternal: false,
    nationalId: "",
    employeeRole: "",
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

    const phoneRegex = /^[0-9]{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
      valid = false;
    } else {
      newErrors.phone = "";
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
    if (!formData.position) {
      newErrors.position = "Position is required";
      valid = false;
    } else {
      newErrors.position = "";
    }
    setErrors(newErrors);
    return valid;
  };

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

  const dispatch = useDispatch();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (active === 0 && validateStep1()) {
      setActive((current) => (current < 1 ? current + 1 : current));
    } else if (active === 1 && validateStep2()) {
      setLoading(true);
      setFormData({
        ...formData,
        name: formData.firstname + " " + formData.lastname,
      });
      authorizedApi
        .post("/employees/create", formData)
        .then((res) => {
          notifications.show({
            message: "Employee is created successfully",
            color: "blue",
          });
          dispatch({
            type: ADD_EMPLOYEE_SUCCESS,
            payload: res.data?.data?.data,
          });
          refetch();
          closeAddEmployee();
        })
        .catch((err) => {
          notifications.show({
            message:
              err.response?.data?.message ?? "Failed to create employee!",
            color: "red",
          });
        });
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddEmployee}
      onClose={closeAddEmployee}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] max-h-[90vh] py-10  relative bg-white rounded-3xl p-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEmployee}
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
          <h1 className="text-2xl font-extrabold">Create employee</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide employee details to register the employee.
          </h2>
        </div>

        <div className="w-full px-10  flex flex-col items-center mt-4 overflow-hidden ">
          <Stepper active={active} onStepClick={setActive} className="w-full">
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
                          <SolarUserBroken />
                        </span>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          placeholder="Type in first name"
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
                          <SolarUserBroken />
                        </span>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          placeholder="Type in last name"
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
                      <SolarLetterLinear />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      placeholder="Type in email"
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
                  <label htmlFor="phone" className="block text-xs font-bold">
                    Phone Number
                  </label>
                  <div className="relative mt-1 rounded-full">
                    <div className="absolute  left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                      <span className="">
                        <SolarIphoneLinear />
                      </span>
                    </div>
                    <div className="absolute left-8 top-2 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                      <span className="text-gray-500 text-sm ml-2">+250</span>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Type in phone"
                      className={`block w-full pl-[6.5rem] pr-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="gender"
                    className="block text-base font-medium text-black"
                  >
                    Gender
                  </label>
                  <div className="mt-1 pl-4 relative block w-full py-1 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-lg">
                      <PhGenderIntersex />
                    </span>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={(value: any) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          gender: value,
                        }))
                      }
                      data={[
                        { value: "male", label: "Male" },
                        {
                          value: "female",
                          label: "Female",
                        },
                        {
                          value: "other",
                          label: "Other",
                        },
                      ]}
                      placeholder="Select your gender"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={closeAddEmployee}
                    className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </form>
            </Stepper.Step>
            <Stepper.Step
              label="Applicant Info"
              description=""
              className="text-xs"
            >
              <form
                onSubmit={handleSubmit}
                className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
              >
                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700"
                  >
                    National ID
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      <SolarLetterLinear />
                    </span>
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      placeholder="Type in ID"
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-8 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.nationalId ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.nationalId && (
                    <p className="text-red-500 text-xs">{errors.nationalId}</p>
                  )}
                </div>
                <div className="">
                  <label
                    htmlFor="position"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Position
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      <SolarSuitcaseLinear />
                    </span>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      placeholder="Type in position"
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-8 p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.position ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.position && (
                    <p className="text-red-500 text-xs">{errors.position}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="position"
                    className="block text-base font-medium text-black"
                  >
                    Is Internal
                  </label>
                  <div className="mt-1 pl-1 flex flex-col gap-2">
                    <Checkbox
                      label="Yes"
                      checked={formData.isInternal}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isInternal: true,
                        })
                      }
                    />
                    <Checkbox
                      label="No"
                      checked={formData.isInternal === false}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isInternal: false,
                        })
                      }
                    />
                  </div>
                </div>

                {!formData.isInternal ? (
                  <div className="w-full mt-4">
                    <label
                      htmlFor="institution"
                      className="block text-base font-medium text-black"
                    >
                      Institution Name
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Enter the institution name"
                      className="mt-1 block w-full pl-4 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required={!formData.isInternal}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <label
                      htmlFor="gender"
                      className="block text-base font-medium text-black"
                    >
                      Employee-role
                    </label>
                    <div className="mt-1 pl-4 relative block w-full py-1 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="absolute left-2 top-3 text-lg">
                        <SolarUserBroken />
                      </span>
                      <Select
                        name="employee role"
                        value={formData.employeeRole}
                        onChange={(value: any) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            employeeRole: value,
                          }))
                        }
                        data={[
                          {
                            value: "NORMAL_EMPLOYEE",
                            label: "normal-employee",
                          },
                          {
                            value: "SDF_SECRETARIAT",
                            label: "SDF-secretariat",
                          },
                          {
                            value: "GRANT_COMMITTEE",
                            label: "grand-committee",
                          },
                        ]}
                        placeholder="Select your employee-role"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={closeAddEmployee}
                    className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Employee
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

export default RegisterModal;
