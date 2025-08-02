import type React from "react"
import { DataTable as OriginalDataTable } from "@/components/core/data-table"

interface CustomDataTableProps {
  columns: any[]
  data: any[]
  loading: boolean
  noDataMessage: string
  loadingBackgroundColor?: string
  loadingColor?: string
  pageSize?: number
}

export const CustomDataTable: React.FC<CustomDataTableProps> = ({
  columns,
  data,
  loading,
  noDataMessage,
  loadingBackgroundColor = "#f1f5f9", // Default light gray
  loadingColor = "#005DE9", // Default blue
  pageSize,
  ...rest
}) => {
  // If your DataTable doesn't accept these props directly,
  // you might need to wrap it with custom loading UI
  return (
    <div className="relative">
      <OriginalDataTable
        columns={columns}
        data={data}
        loading={loading}
        noDataMessage={noDataMessage}
        {...rest}
      />

      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: loadingBackgroundColor, opacity: 0.7 }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
            style={{ borderColor: loadingColor }}
          ></div>
        </div>
      )}
    </div>
  )
}
