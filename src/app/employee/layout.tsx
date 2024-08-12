"use client";
import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
import adminRoutes from "@/utils/routes/admin";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCompresed, setIsCompressed] = useState(false);
  return (
    <div className="w-screen h-screen flex justify-between bg-background p-3 overflow-hidden">
      <div
        className={`${isCompresed ? "w-[6%]" : "w-[23%]"} h-[99%] bg-white rounded-2xl side-section`}
      >
        <GenericSidebar
          routes={adminRoutes}
          isCompressed={isCompresed}
          toggle={() => setIsCompressed(!isCompresed)}
        />
      </div>
      <div
        className={`${isCompresed ? "w-[93%]" : "w-[75%]"} h-[99%] bg-transparent side-section`}
      >
        <Navbar />
        <div className="h-[95%] overflow-y-auto pt-8 pb-32  pages-parent">
          {children}
        </div>
      </div>
    </div>
  );
}
