"use client";
import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { authorizedApi } from "@/utils/api";

interface Props {
  isOpenEditTrainee: boolean;
  closeEditTrainee: () => void;
}

const AddTrainee = ({ isOpenEditTrainee, closeEditTrainee }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: null as Date | null,
      maritalStatus: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        value.length < 10 ? "Phone number must be at least 10 digits" : null,
      dateOfBirth: (value) => (value ? null : "Date of birth is required"),
      maritalStatus: (value) => (value ? null : "Marital status is required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        nationalId: values.idNumber,
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        gender: values.gender.toUpperCase(),
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString().split("T")[0]
          : undefined,
        maritalStatus: values.maritalStatus,
      };
      await authorizedApi.post("/applicant/trainees", payload);
      setSuccess(true);
      form.reset();
      closeEditTrainee();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add trainee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenEditTrainee}
      onClose={closeEditTrainee}
      withCloseButton={false}
      centered
    >
      <div className="w-[70vw] min-w-[350px] max-w-[1100px] h-auto flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
        {/* Close Icon */}
        <div className="absolute top-3 right-3 m-4 text-center mt-0">
          <button
            onClick={closeEditTrainee}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={loading}
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2 text-center font-bold mb-4">
          <h2 className="text-3xl font-bold text-primaryText">
            Add New Trainee
          </h2>
          <p className="text-primaryText opacity-40 font-medium text-xl">
            Fill in the details to add a trainee.
          </p>
        </div>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4 text-primaryText"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Row 1: First Name / Last Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="font-semibold">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter first name"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("firstName")}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="font-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter last name"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("lastName")}
                disabled={loading}
              />
            </div>
            {/* Row 2: ID Number / Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="idNumber" className="font-semibold">
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                placeholder="Enter ID number"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("idNumber")}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("email")}
                disabled={loading}
              />
            </div>
            {/* Row 3: Phone Number / Gender */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter phone number"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("phone")}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="font-semibold">
                Gender
              </label>
              <select
                id="gender"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("gender")}
                disabled={loading}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            {/* Row 4: Date of Birth / Marital Status */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className="font-semibold">
                Date of Birth
              </label>
              <DateInput
                id="dateOfBirth"
                placeholder="Pick date"
                value={form.values.dateOfBirth}
                onChange={(date) => form.setFieldValue("dateOfBirth", date)}
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                disabled={loading}
                maxDate={new Date()}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="maritalStatus" className="font-semibold">
                Marital Status
              </label>
              <select
                id="maritalStatus"
                className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
                required
                {...form.getInputProps("maritalStatus")}
                disabled={loading}
              >
                <option value="" disabled>
                  Select marital status
                </option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="border text-center bg-primary rounded-full p-2 text-white font-semibold text-xl mt-2">
            <input
              type="submit"
              value={loading ? "Adding..." : "Add Trainee"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTrainee;
