"use client";

import { SolarAddFolderBold } from "@/components/core/icons";

import Link from "next/link";

const Page = () => {
  return (
    <Link
      href={"/admin/survey/create-edit/create"}
      className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
    >
      <span className="text-2xl">
        <SolarAddFolderBold />
      </span>
      <h1 className="text-base font-medium text-white">New Survey</h1>
    </Link>
  );
};

export default Page;
