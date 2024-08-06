/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaEnvelope, FaLock } from "react-icons/fa";
import RegisterModal from "./RegisterModal";
import { useRouter} from "next/navigation";
const router=useRouter()
const LoginModal = ({
  opened,
  close,
  openRegister,
}: {
  opened: boolean;
  close: () => void;
  openRegister: () => void;
}) => {
  const [isOpenRegister, setIsOpenRegister] = useState(false);

  const handleOpenRegister = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    close();
    setIsOpenRegister(true);
  };
    const handleLogin = () => {
    router.push('../../app/admin/page.tsx');
  };


  return (
      <div>
          <Modal
              opened={opened}
              onClose={close}
              withCloseButton={false}
              centered
              className="size-3 flex flex-col gap-4 rounded-full"
          >
              {/* Close Icon */}
              <div className="w-full h-full flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
                  <div className="absolute top-3 right-3 m-4 text-center mt-0">
                      <button
                          onClick={close}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                          <IoMdClose size={24} />
                      </button>
                  </div>

                  <div className="flex flex-col gap-2 text-center font-bold mb-4">
                      <h2 className="text-2xl font-bold">Login</h2>
                      <p className="text-gray-600">
                          Provide your credentials to login.
                      </p>
                  </div>

                  <form className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                          <label htmlFor="email" className="font-semibold">
                              Email
                          </label>
                          <div className="relative w-full">
                              <span className="inline-block mr-2 absolute top-3 left-2">
                                  <FaEnvelope />
                              </span>
                              <input
                                  type="email"
                                  id="email"
                                  placeholder="type in email"
                                  name="email"
                                  className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8"
                                  required
                              />
                          </div>
                      </div>
                      <div className="flex flex-col gap-2 font-semibold">
                          <div className="flex flex-col gap-2">
                              <label
                                  htmlFor="password"
                                  className="font-semibold"
                              >
                                  Password
                              </label>
                              <div className="relative w-full">
                                  <span className="inline-block mr-2 absolute top-3 left-2">
                                      <FaLock />
                                  </span>
                                  <input
                                      type="password"
                                      id="password"
                                      placeholder="type in password"
                                      name="password"
                                      className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8"
                                      required
                                  />
                              </div>
                              <div>
                                  <span></span>
                              </div>
                          </div>

                          <p>Forgot password?</p>
                      </div>
                      <div
                          className="border text-center bg-primary rounded-2xl p-2 text-white font-semibold text-xl"
                          onClick={handleLogin}
                      >
                          <input type="submit" value="Login" />
                      </div>
                  </form>
                  <div>
                      <p>
                          Don't have an account?{" "}
                          <a
                              href="#"
                              className="font-bold text-primary"
                              onClick={() => {
                                  close();
                                  openRegister();
                              }}
                          >
                              Sign up
                          </a>
                      </p>
                  </div>
              </div>
          </Modal>
      </div>
  );
};

export default LoginModal;
