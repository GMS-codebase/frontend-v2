"use client";
import Navbar from "@/components/Navbar/Navbar";
import GenericSidebar from "@/components/sidebar/GenericSidebar";
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
    (state: any) => state.announcement
  );

  return (
    <div className="w-screen h-screen flex flex-col justify-between bg-background p-3 overflow-hidden">
      {announcement &&
        announcement?.roles?.includes("APPLICANT") &&
        announcement.status === "ACTIVE" &&
        showAnnouncement && (
          <div className="w-full bg-blue-100 p-2 mb-2 relative">
            <div
              className={`text-blue-800 pr-8 ${announcement?.announcement?.length > 100 ? "animate-scroll" : ""}`}
            >
              <span className="font-bold">Announcement: </span>{" "}
              {announcement?.announcement}
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-600"
              aria-label="Close announcement"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
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
