import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next13-progressbar";
import Image from "next/image";
import { SolarLetterLinear } from "../../core/icons";
import { FiCreditCard } from "react-icons/fi";
import { notifications } from "@mantine/notifications";

const TraineeLoginModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    email: string;
    nationalId: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://197.243.20.222:8081/api/v2/applicant/trainees/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      console.log("TraineeLogin: API Response:", data);

      if (response.ok) {
        console.log("TraineeLogin: Login successful, preparing to store data");

        try {
          // Store trainee data in localStorage
          const traineeData = {
            email: values.email,
            nationalId: values.nationalId,
            isAuthenticated: true,
            role: "TRAINEE",
          };

          console.log("TraineeLogin: Storing data:", traineeData);
          localStorage.setItem("traineeData", JSON.stringify(traineeData));

          // Verify storage
          const storedData = localStorage.getItem("traineeData");
          console.log("TraineeLogin: Verification of stored data:", storedData);

          if (!storedData) {
            throw new Error("Failed to store authentication data");
          }

          // Close the modal first
          console.log("TraineeLogin: Closing modal");
          close();

          // Show success notification
          notifications.show({
            title: "Login Successful",
            message: data.message || "Welcome!",
            color: "green",
          });

          // Navigate after a short delay
          console.log("TraineeLogin: Preparing to navigate");
          setTimeout(() => {
            console.log("TraineeLogin: Navigating to trainee page");
            navigate.push("/trainee");
          }, 500);
        } catch (error) {
          console.error("TraineeLogin: Error during login process:", error);
          notifications.show({
            title: "Login Error",
            message: "Failed to complete login process. Please try again.",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "Login Failed",
          message: data.message || "Invalid credentials.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Login Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
    }
    setLoading(false);
  };

  const form = useForm({
    initialValues: {
      email: "",
      nationalId: "",
    },

    validate: {
      email: (value) =>
        value
          ? /^\S+@\S+\.\S+$/.test(value)
            ? null
            : "Invalid email"
          : "Email is required",
      nationalId: (value) => (value ? null : "National ID is required"),
    },
  });

  return (
    <Modal
      size={""}
      opened={opened}
      onClose={close}
      withCloseButton={false}
      centered
    >
      <div className="lg:w-[40vw] max-h-[90vh] py-10 flex flex-col gap-2 align-middle rounded-3xl bg-white p-10 relative">
        <Image
          src={require("@/assets/Vectors/sidevecto.svg")}
          alt=""
          className="absolute right-0 bottom-[30%] w-8"
        />
        <Image
          src={require("@/assets/Vectors/sidevector2.svg")}
          alt=""
          className="absolute left-0 top-[10%] w-8"
        />
        <div className="absolute top-3 right-3 m-4 text-center mt-0">
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 focus:outline-none bg-primaryText bg-opacity-5 p-2 rounded-xl"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-2 text-center font-bold mb-4">
          <h2 className="text-3xl font-bold text-primaryText">Trainee Login</h2>
          <p className="text-primaryText opacity-40 font-medium text-xl">
            Provide your credentials to access the trainee portal.
          </p>
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="text-primaryText w-full"
        >
          <div className="flex flex-col gap-1 mt-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <div className="relative w-full">
              <span className="absolute top-1/2 -translate-y-1/2 left-3">
                <SolarLetterLinear className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="email"
                placeholder="Type in your email"
                name="email"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 outline-primary transition-all duration-150"
                {...form.getInputProps("email")}
              />
            </div>
            {form.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-10 mb-2">
            <label htmlFor="nationalId" className="font-semibold">
              National ID
            </label>
            <div className="relative w-full">
              <span className="absolute top-1/2 -translate-y-1/2 left-3">
                <FiCreditCard className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="nationalId"
                placeholder="Type in your national ID"
                name="nationalId"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 outline-primary transition-all duration-150"
                {...form.getInputProps("nationalId")}
              />
            </div>
            {form.errors.nationalId && (
              <p className="text-red-500 text-sm mt-1">
                {form.errors.nationalId}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="border bg-primary !rounded-full p-3 text-white font-semibold text-xl !w-full mt-10"
            disabled={loading}
          >
            {!loading ? "Login" : "Loading ..."}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default TraineeLoginModal;
