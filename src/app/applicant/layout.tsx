"use client";
<<<<<<< HEAD
import React from "react";

export default function AdminLayout({
=======
import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
import applicantRoutes from "@/utils/routes/applicant";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";

export default function ApplicantLayout({
>>>>>>> cc1ef01ab75b571b369cb7c9b0634ccfedd8f04d
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  return (
    <div className="w-screen h-screen flex justify-between bg-background p-3 overflow-hidden">
        <div className="h-[95%] overflow-y-auto pt-8 pages-parent">
          {children}
        </div>
=======
  const [isCompresed, setIsCompressed] = useState(false);
  return (
    <div className="w-screen h-screen flex justify-between bg-background p-3 overflow-hidden">
      <div
        className={`${
          isCompresed ? "w-[6%]" : "w-[23%]"
        } h-[99%] bg-white rounded-2xl side-section`}
      >
        <GenericSidebar
          routes={applicantRoutes}
          isCompressed={isCompresed}
          toggle={() => setIsCompressed(!isCompresed)}
        />
      </div>
      <div
        className={`${
          isCompresed ? "w-[93%]" : "w-[75%]"
        } h-[99%] bg-transparent side-section`}
      >
        <Navbar />
        <div className="h-[95%] overflow-y-auto pt-8 pb-32  pages-parent">
          {children}
        </div>
      </div>
>>>>>>> cc1ef01ab75b571b369cb7c9b0634ccfedd8f04d
    </div>
  );
}
