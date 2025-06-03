"use client";
import React from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useForm } from "@mantine/form";

interface Props {
  isOpenEditTrainee: boolean;
  closeEditTrainee: () => void;
}

const AddTrainee = ({ isOpenEditTrainee, closeEditTrainee }: Props) => {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      phone: "",
      gender: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        value.length < 10 ? "Phone number must be at least 10 digits" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // TODO: Add API call to save trainee
    closeEditTrainee();
  };

  return (
    <Modal
      size={""}
      opened={isOpenEditTrainee}
      onClose={closeEditTrainee}
      withCloseButton={false}
      centered
    >
      <div className="w-[40vw] min-w-[350px] max-w-[600px] h-auto flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
        {/* Close Icon */}
        <div className="absolute top-3 right-3 m-4 text-center mt-0">
          <button
            onClick={closeEditTrainee}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-1/2">
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
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
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
              />
            </div>
          </div>
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
            />
          </div>
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
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="border text-center bg-primary rounded-full p-2 text-white font-semibold text-xl mt-2">
            <input type="submit" value="Add Trainee" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTrainee;
