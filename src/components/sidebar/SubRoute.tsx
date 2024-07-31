"use client";
import { Route } from "@/types";
import { Collapse } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { BiChevronRight } from "react-icons/bi";

const WithSubRoutes: FC<{
  route: Route;
  path: string;
  opened: string;
  setOpened: any;
}> = ({ route, path, opened, setOpened }) => {
  const active = usePathname();
  const isActiveLink = (linkPath: string) => path.startsWith(linkPath);
  return (
    <div key={route.label} className="flex flex-col mx-3">
      <button
        className={
          // ? 'flex flex-row gap-5 items-center p-3 rounded-lg bg-[rgba(42,10,82,0.1)] text-[rgba(42,10,82,0.8)] my-2'
          `flex items-center gap-5 px-4 py-3 pl-10 hover:bg-blue-200 cursor-pointer text-sm rounded-md ${opened === route.path ? "border-l-4 border-l-blue-400" : ""}`
        }
        onClick={() => setOpened(opened === route.label ? "" : route.label)}
      >
        {route.icon}
        {route.label}
        <BiChevronRight
          size={25}
          className={`ml-auto duration-300 ${opened === route.label ? " rotate-90" : " rotate-0"}`}
        />
      </button>
      <Collapse in={opened === route.label}>
        <div className="flex flex-col w-full pl-4">
          {route.subRoutes?.map((subRoute, subIndex) => (
            <Link
              href={subRoute.path}
              key={subIndex}
              className={`flex items-center gap-5 px-4 py-3 pl-10 ml-3 my-1 ${active === subRoute.path ? "bg-[#5D87FF] text-white" : "bg-white"} hover:bg-blue-200 cursor-pointer rounded-md`}
            >
              {subRoute.icon}
              <span
                className={`text-sm ${active === subRoute.path ? "font-semibold text-white" : ""}`}
              >
                {subRoute.label}
              </span>
            </Link>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default WithSubRoutes;
