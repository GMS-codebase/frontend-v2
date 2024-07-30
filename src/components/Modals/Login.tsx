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
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Authentication"
                centered
            >
                {/* Close Icon */}
                <div className="w-full h-full">
                    <div className="absolute top-0 left-0 m-4">
                        <button
                            onClick={close}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <IconX size={24} />
                        </button>
                    </div>

                    <div>
                        <h2>Login</h2>
                        <p>Provide your credentials to login.</p>
                    </div>

                    <form>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
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
        </>
    );
};

export default AuthenticationModal;
