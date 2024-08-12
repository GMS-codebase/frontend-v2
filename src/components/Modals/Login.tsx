/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next13-progressbar";
import Image from "next/image";
import {
    SolarLetterLinear,
    SolarLockKeyholeMinimalisticOutline,
} from "../core/icons";

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
    const handleSubmit = (e: any) => {
        e.preventDefault();
        navigate.push("/admin");
    };

    return (
        <div>
            <Modal
                size={""}
                opened={opened}
                onClose={close}
                withCloseButton={false}
                centered
                // className=" flex flex-col gap-4 rounded-full"
            >
                {/* Close Icon */}
                <div className="w-[40vw] h-[70vh] flex flex-col gap-2 align-middle rounded-2xl bg-white p-10 relative">
                    <Image
                        src={require("@/assets/Vectors/sidevecto.svg")}
                        alt=""
                        className="absolute  right-0 bottom-[30%] w-8"
                    />
                    <Image
                        src={require("@/assets/Vectors/sidevector2.svg")}
                        alt=""
                        className="absolute  left-0 top-[10%] w-8"
                    />
                    <div className="absolute top-3 right-3 m-4 text-center mt-0">
                        <button
                            onClick={close}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 text-center font-bold mb-4">
                        <h2 className="text-3xl font-bold text-primaryText">
                            Login
                        </h2>
                        <p className="text-primaryText opacity-40 font-medium text-xl">
                            Provide your credentials to login.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 text-primaryText"
                    >
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-semibold">
                                Email
                            </label>
                            <div className="relative w-full">
                                <span className="inline-block mr-2 absolute top-3 left-2">
                                    <SolarLetterLinear />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="type in email"
                                    name="email"
                                    className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8 outline-primary transition-all duration-150"
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
                                        <SolarLockKeyholeMinimalisticOutline />
                                    </span>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="type in password"
                                        name="password"
                                        className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8 outline-primary transition-all duration-150"
                                        required
                                    />
                                </div>
                                <div>
                                    <span></span>
                                </div>
                            </div>

                            <p className="text-secondaryText font-medium">
                                Forgot password?
                            </p>
                        </div>
                        <div className="border text-center bg-primary rounded-full p-2 text-white font-semibold text-xl">
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                    <div>
                        <p className="text-center text-primaryText opacity-40 text-lg">
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
