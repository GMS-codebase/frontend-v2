import React, { useState } from "react";
import { Modal, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next13-progressbar";
import AuthService from "@/services/auth";
import Image from "next/image";
import {
  SolarLetterLinear,
  SolarLockKeyholeMinimalisticOutline,
} from "../../core/icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = ({
  opened,
  close,
  openRegister,
}: {
  opened: boolean;
  close: () => void;
  openRegister: () => void;
}) => {
  const navigate = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    await AuthService.login(
      {
        email: values.email,
        password: values.password,
      },
      (role: string) => {
        switch (role?.toLowerCase()) {
          case "admin":
            navigate.push("/admin");
            break;
          case "dynamic":
            navigate.push("/dynamic");
            break;
          case "employee":
            navigate.push("/employee");
            break;
          case "normal_employee":
            navigate.push("/employee");
            break;
          case "applicant":
            navigate.push("/applicant/applications");
            break;
          case "grant_committee":
            navigate.push("/grant_committee");
            break;
          case "sdf_secretariate":
            navigate.push("/sdf/contracts");
            break;
          default:
            navigate.push("/");
        }
      },
    );
    setLoading(false);
  };
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        value
          ? /^\S+@\S+\.\S+$/.test(value)
            ? null
            : "Invalid email"
          : "Email is required",
      password: (value) => (value ? null : "Password is required"),
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
      <div className="lg:w-[40vw] max-h-[90vh] py-10  flex flex-col gap-2 align-middle rounded-3xl bg-white p-10 relative">
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
          <h2 className="text-3xl font-bold text-primaryText">Login</h2>
          <p className="text-primaryText opacity-40 font-medium text-xl">
            Provide your credentials to login.
          </p>
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className=" text-primaryText w-full "
        >
          <div className="flex flex-col gap-1 mt-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <div className="relative w-full">
              <span className="absolute top-1/2  -translate-y-1/2  left-3">
                <SolarLetterLinear className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="email"
                placeholder="Type in your email "
                name="email"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 outline-primary transition-all duration-150"
                {...form.getInputProps("email")}
              />
            </div>
            {form.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1  mt-10 mb-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="relative w-full">
              <span className="absolute top-1/2  -translate-y-1/2  left-3">
                <SolarLockKeyholeMinimalisticOutline className="w-5 h-5" />
              </span>
              <input
                type={!showPassword ? "password" : "text"}
                id="password"
                placeholder="Type in your password"
                name="password"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 outline-primary transition-all duration-150"
                {...form.getInputProps("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.errors.password}
              </p>
            )}
          </div>

          <div className="text-secondaryText font-medium  underline mb-10">
            Forgot password?
          </div>
          <button
            type="submit"
            className="border bg-primary !rounded-full p-3 text-white font-semibold text-xl !w-full "
            disabled={loading}
          >
            {!loading ? "Login" : "Loading ..."}
          </button>
        </form>

        <div>
          <p className="text-center text-primaryText  text-lg">
            Don&apos;t have an account?{" "}
            <span
              className="font-bold text-primary cursor-pointer"
              onClick={() => {
                close();
                openRegister();
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
