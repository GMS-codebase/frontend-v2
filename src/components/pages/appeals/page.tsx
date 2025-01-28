"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import ViewAppealModal from "@/components/Modals/appeal/ViewAppeal";
import { getColumns } from "./columns";

const AppealsPage = () => {
  const { appeals, loading } = useSelector((state: any) => state.appeals);
  const [viewAppeal, setViewAppeal] = useState<any>({
    open: false,
    appeal: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAppeals = appeals?.filter((appeal: any) => {
    const query = searchQuery.toLowerCase();
    return appeal?.appeal_comment.toLowerCase().includes(query);
  });

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base placeholder:text-black text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={getColumns({setViewAppeal})}
          data={filteredAppeals}
          noDataMessage="No Appeals Created Yet"
          loading={loading}
        />
      </div>
      <ViewAppealModal
        isOpen={viewAppeal.open}
        onClose={() => setViewAppeal({ open: false, appeal: null })}
        appeal={viewAppeal.appeal}
      />
    </div>
  );
};

export default AppealsPage;
