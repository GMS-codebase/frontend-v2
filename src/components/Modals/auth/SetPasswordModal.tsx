import React from "react";
import { Modal, Button, Progress } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IoMdClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthService from "@/services/auth";
import { SolarLockKeyholeMinimalisticOutline } from "../../core/icons";
import Image from "next/image";

const SetPasswordModal = ({
  opened,
  close: closeSetPassword,
  token,
  openLogin,
}: {
  opened: boolean;
  token: string;
  close: () => void;
  openLogin: () => void;
}) => {
  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) => {
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Password must contain at least one special character";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords must match" : null,
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    await AuthService.setPassword(
      { password: values.password, confirmpassword: values.confirmPassword },
      token,
      () => {
        closeSetPassword();
        openLogin();
      }
    );
    setLoading(false);
  };

  return (
    <Modal
      size=""
      opened={opened}
      onClose={closeSetPassword}
      withCloseButton={false}
      centered
    >
      <div className="w-[500px] py-10 px-6 bg-white rounded-3xl relative">
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
        <button
          onClick={() => closeSetPassword()}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Set Your Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create a strong password with a mix of letters, numbers, and symbols.
        </p>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-3">
                <SolarLockKeyholeMinimalisticOutline className="w-5 h-5 text-gray-500" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...form.getInputProps("password")}
                placeholder="Enter your password"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.errors.password && (
              <p className="text-red-500 text-sm">{form.errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-3">
                <SolarLockKeyholeMinimalisticOutline className="w-5 h-5 text-gray-500" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...form.getInputProps("confirmPassword")}
                placeholder="Confirm your password"
                className="w-full bg-gray-100 p-3 rounded-3xl pl-10 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {form.errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary rounded-full p-3 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Loading..." : "Set Password"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SetPasswordModal;
