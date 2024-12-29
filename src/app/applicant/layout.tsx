"use client";
import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
import Announcement from "@/components/ui/Announcement";
import applicantRoutes from "@/utils/routes/applicant";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { announcement, loading } = useSelector(
    (state: any) => state.announcement,
  );

  return (
    <div className="w-screen h-screen flex flex-col justify-between bg-background p-3 overflow-hidden">
      {announcement &&
        announcement?.roles?.includes("APPLICANT") &&
        announcement.status === "ACTIVE" &&
        showAnnouncement && (
        <Announcement announcement={announcement} setShowAnnouncement={setShowAnnouncement}/>
        )}
      <div className="flex justify-between">
        <div
          className={`${
            isCompressed ? "w-[6%]" : "w-[23%]"
          } h-full bg-white rounded-2xl side-section`}
        >
          <GenericSidebar
            routes={applicantRoutes}
            isCompressed={isCompressed}
            toggle={() => setIsCompressed(!isCompressed)}
          />
        </div>
        <div
          className={`${
            isCompressed ? "w-[93%]" : "w-[75%]"
          } h-screen flex flex-col  bg-transparent side-section`}
        >
          <Navbar />
          <div className="flex-grow overflow-y-scroll pt-8 pb-32 pages-parent ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
