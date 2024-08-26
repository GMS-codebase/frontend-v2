"use client";
import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
import adminRoutes from "@/utils/routes/admin";
import dynamicRoutes from "@/utils/routes/dynamic";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, loading } = useSelector((state: any) => state.auth);
  const [isCompresed, setIsCompressed] = useState(false);

  const getUserRoutes = () => {
    return dynamicRoutes.filter((route) =>
      userProfile?.data?.tabs.includes(route.label),
    );
  };

  return (
    <div className="w-screen h-screen flex justify-between bg-background p-3 overflow-hidden">
      <div
        className={`${isCompresed ? "w-[6%]" : "w-[23%]"} h-[99%] bg-white rounded-2xl side-section`}
      >
        <GenericSidebar
          isDynamic={true}
          loading={loading}
          routes={getUserRoutes()}
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
