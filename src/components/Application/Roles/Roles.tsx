"use client"
import { SolarShieldUserBold } from "@/components/core/icons";
import React, { useState } from "react";
import { Menu } from "@mantine/core"; // Importing Mantine's Menu component for the dropdown
import Link from "next/link";
interface RolesProps {
    role: string;
    numberOfUsers: number;
    id: string; // Add the id prop here
}

const Roles: React.FC<RolesProps> = ({ role, numberOfUsers, id }) => {
    const [menuOpened, setMenuOpened] = useState(false);

    return (
        <div className="bg-[#005DE9] bg-opacity-10 flex flex-col items-center justify-center p-5 rounded-3xl relative">
            {/* Kebab Menu (Three Dots) */}
            <div className="absolute top-2 right-2">
                <Menu
                    opened={menuOpened}
                    onOpen={() => setMenuOpened(true)}
                    onClose={() => setMenuOpened(false)}
                    shadow="lg"
                    width={150}
                >
                    <Menu.Target>
                        <button onClick={() => setMenuOpened(!menuOpened)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500 cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v.01M12 12v.01M12 18v.01"
                                />
                            </svg>
                        </button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={() => setMenuOpened(false)}>
                            <Link
                                href={`/admin/roles/${id}`} // Use the id prop here
                                className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                            >
                                View
                            </Link>
                        </Menu.Item>

                        <Menu.Item onClick={() => console.log("Edit clicked")}>
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            onClick={() => console.log("Remove clicked")}
                        >
                            Remove
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>

            {/* Icon and Text */}
            <span className="text-[#005DE9] text-5xl">
                <SolarShieldUserBold />
            </span>
            <p className="text-xl font-semibold">{role}</p>
            <p className="text-sm">Users: {numberOfUsers}</p>
        </div>
    );
};

export default Roles;
