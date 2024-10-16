"use client";
import { useState } from "react";
import * as Icons from "@/components/core/icons";
import { SolarUploadBold } from "@/components/core/icons";
import { Select } from "@mantine/core";
import Image from "next/image";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { Upload } from "solar-icon-set";
import Profile from "@/components/Profile";
const Page = () => {
  const [activeSection, setActiveSection] = useState("contact");
  return (
    <Profile/>
  );
};

export default Page;
