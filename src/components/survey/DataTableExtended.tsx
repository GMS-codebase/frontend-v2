"use client"
import type { DataTableProps } from "../../app/admin/survey/types"
import { DataTable } from "@/components/core/data-table"

// This is a wrapper component for the DataTable to ensure proper TypeScript support
export const DataTableExtended = ({
  columns,
  data,
  loading,
  noDataMessage,
  pageSize = 6,
}: DataTableProps) => {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        noDataMessage={noDataMessage}
      />
    </div>
  )
}
