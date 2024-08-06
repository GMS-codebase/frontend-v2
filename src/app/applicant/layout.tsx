"use client";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex justify-between bg-background p-3 overflow-hidden">
        <div className="h-[95%] overflow-y-auto pt-8 pages-parent">
          {children}
        </div>
    </div>
  );
}
