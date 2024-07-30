import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const AuthenticationModal = ({
    opened,
    close
}: {
    opened: boolean;
    close: () => void;
}) => {
    // const [opened, { open, close }] = useDisclosure(true); // Open by default

    return (
        <div className="p-50">
            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false}
                centered
                className=" size-3 flex flex-col gap-4 "
            >
                {/* Close Icon */}
                <div className="w-full h-full  flex flex-col gap-2 align-middle rounded-full bg-white">
                    <div className="absolute top-0 left-0 m-4 text-center mt-0">
                        <button
                            onClick={close}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none  "
                        >
                            <IconX size={24} />
                        </button>
                    </div>

                    <div className=" flex flex-col gap-2 text-center">
                        <h2>Login</h2>
                        <p className="text-gray-600">
                            Provide your credentials to login.
                        </p>
                    </div>

                    <form className=" flex flex-col gap-4">
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="pt-4 rounded-xl flex "
                                required
                            />
                        </div>
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="pt-4 rounded-xl "
                                required
                            />
                            <p>Forgot password</p>
                        </div>
                        <div>
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                    <div>
                        <p>
                            Don't have an account?{" "}
                            <a href="#" className="font-bold text-[#005DE9]">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AuthenticationModal;
