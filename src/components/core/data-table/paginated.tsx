"use client";

import { PaginationState } from "@/types/data-table.type";
import { Input, Pagination, Select, Skeleton } from "@mantine/core";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import * as React from "react";
import PaginationForm from "./PaginateForm";
import TableSkeleton from "./TableSkeleton";
import { getApplications, getApplicationsPaginated } from "@/services";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";

interface PaginationFuncs {
  onChangePage: (page: number, limit: number) => void;
  onNextPage: (page: number, limit: number) => void;
  onPreviousPage: (page: number, limit: number) => void;
}
interface Props {
  data: any;
  columns: ColumnDef<any>[];
  searchKey?: string;
  searchElement?: React.ReactNode;
  paginationProps?: PaginationState;
  actionElement?: React.ReactNode;
  minW?: string;
  tableClass?: string;
  buttonElement?: React.ReactNode;
  renderCustomElement?: (table: Table<any>) => React.ReactNode;
  noDataMessage?: React.ReactNode;
  loading?: boolean;
  loader?: React.ReactNode;
  limit?: number;
  tableWidth?: string | number;
  verticalPadding?: string | number;
  totalApplications?: number;
  page: number;
  setPage: (page: number) => void;
  paginationFuncs: PaginationFuncs;
}

export function DataTable({
  data,
  columns,
  searchKey,
  searchElement,
  paginationProps,
  actionElement,
  minW,
  buttonElement,
  tableClass,
  renderCustomElement,
  noDataMessage,
  loading,
  limit = 10,
  loader,
  tableWidth,
  verticalPadding,
  totalApplications,
  page,
  setPage,
  paginationFuncs,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const dispatch = useDispatch();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: paginationProps?.paginateOpts.page ?? 0,
    pageSize: paginationProps?.paginateOpts.limit ?? limit ?? 10,
  });
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const newColumns: ColumnDef<any>[] = [...columns];

  const table = useReactTable({
    data,
    columns: newColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    debugTable: true,
    onPaginationChange: setPagination,
    manualPagination: paginationProps?.isPaginated,
    rowCount: totalApplications,
    enableGlobalFilter: true,
  });
  const isPaginated = paginationProps?.isPaginated ?? false;

  const onPaginate = (page: number) => {
    if (isPaginated) {
      paginationProps?.setPaginateOpts({
        ...paginationProps?.paginateOpts,
        page,
      });
      return;
    }
    table?.setPageIndex(page);
  };

  return (
    <div className="w-full text-sm">
      {renderCustomElement && renderCustomElement(table)}
      <div className="flex w-full justify-between gap-x-2">
        {searchElement ? (
          searchElement
        ) : searchKey ? (
          <div className="flex w-full items-center py-4">
            <Input
              type="text"
              placeholder={`Search ...`}
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="lg:max-w-xs max-w-[16em] w-full rounded-md duration-300"
            />
          </div>
        ) : (
          <div></div>
        )}
        {actionElement && actionElement}
        {buttonElement && buttonElement}
      </div>
      {loading ? (
        (loader ?? (
          <div className={`${tableClass} w-full overflow-auto data-table`}>
            <table className={`w-full table-row-spacing`}>
              <thead className="text-mainPurple">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="bg-[#005DE914] text-xl" key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <td
                        className={clsx(
                          "p-2 font-medium py-5 whitespace-nowrap text-xl text-primary ",
                          i === 0 && "pl-4",
                          i === headerGroup.headers.length - 1 && "pr-4",
                        )}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </td>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {[...Array(10)].map((_, index) => (
                  <tr key={index} className="">
                    {columns.map((column, i) => (
                      <td key={i} className="px-4 py-5">
                        <Skeleton height={20} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <>
          <div className={`${tableClass} w-full overflow-auto data-table`}>
            <table
              className={`table-row-spacing`}
              style={{ width: tableWidth ?? "100%" }}
            >
              <thead className="text-mainPurple">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="bg-[#005DE914] text-xl" key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <td
                        className={clsx(
                          "p-2 font-medium py-5 whitespace-nowrap text-xl text-primary ",
                          i === 0 && "pl-4",
                          i === headerGroup.headers.length - 1 && "pr-4",
                        )}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </td>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table?.getRowModel().rows?.length ? (
                  table?.getRowModel().rows?.map((row, i) => (
                    <tr
                      className={`overflow-hidden text-base ${
                        i % 2 === 0 ? "bg-[#FBFBFB]" : "bg-[#FFF]"
                      }`}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, i) => (
                        <td
                          className={clsx(
                            `p-2 py-${verticalPadding ?? "3"} my-1 table-text`,
                            row.getIsSelected()
                              ? "bg-mainPurple font-semibold"
                              : "",
                            i === 0 && " pl-4",
                            i === row.getVisibleCells().length - 1 && " pr-4",
                          )}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      className="h-24 text-center text-gray-700 text-sm"
                    >
                      {noDataMessage ?? "No Data So far ..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex w-full justify-between items-start flex-row-reverse px-10 mt-4">
            <Pagination
              total={
                paginationProps?.paginateOpts?.totalPages ??
                table?.getPageCount()
              }
              value={(paginationProps?.paginateOpts?.page ?? 0) + 1}
              onChange={(page) => {
                setPage(page);
                paginationFuncs.onChangePage(page, limit);
              }}
              onNextPage={() => {
                setPage(page + 1);
                paginationFuncs.onNextPage(page, limit);
              }}
              onPreviousPage={() => {
                setPage(page - 1);
                paginationFuncs.onPreviousPage(page, limit);
              }}
            />

            <div className="flex md:flex-row flex-col text-sm items-center gap-2 justify-center">
              <h1 className="text-lg font-medium text-[#B5B7C0]">
                Showing data 1 to{" "}
                {table.getRowCount() < 10 ? table.getRowCount() : 10} of{" "}
                {isPaginated ? totalApplications : table.getRowCount()} entries
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
