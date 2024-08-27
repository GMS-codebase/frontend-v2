"use client";
import { SolarUserPlusBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import Actions from "./EmployeeAction";
import { CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddEmployee from "@/components/Modals/AddEmployee";
import UpdateEmployee from "@/components/Modals/UpdateEmployee";
import DeleteEmployee from "@/components/Modals/DeleteEmployee";
import NewRoleModal from "@/components/Modals/newRole"; // Import the NewRoleModal component
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { getEmployees } from "@/utils/funcs";

const Page = () => {
  const [
    isOpenAddEmployee,
    { open: openAddEmployee, close: closeAddEmployee },
  ] = useDisclosure(false);
  const [isOpenAddRole, { open: openAddRole, close: closeAddRole }] =
    useDisclosure(false);
  const employees = useSelector((state: any) => state.employees);
  console.log(employees);
  const [isOpenEmployee, setIsOpenEmployee] = useState({
    openUpdate: false,
    openDelete: false,
    employee: null,
  });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.original?.phone}</div>,
    },
    {
      accessorKey: "nationalId",
      header: "National Id",
      cell: ({ row }) => <div>{row.original?.nationalId}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original?.title}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Actions employee={row.original} setIsEmployee={setIsOpenEmployee} />
      ),
    },
  ];
  const dispatch = useDispatch();
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
          />
        </div>
      </div>

      {employees?.loading ? (
        <div className="w-full h-full">
          <TableSkeleton columns={columns} />
        </div>
      ) : employees?.error ? (
        <div className="w-full flex justify-center items-center">
          <h1 className="text-red-500 font-bold">{employees.error}</h1>
        </div>
      ) : (
        <div className="w-full h-full">
          <DataTable columns={columns} data={employees?.employees ?? []} />
        </div>
      )}
      <AddEmployee
        isOpenAddEmployee={isOpenAddEmployee}
        closeAddEmployee={closeAddEmployee}
        refetch={() => getEmployees(dispatch)}
      />
      <UpdateEmployee
        isOpenUpdateEmployee={isOpenEmployee.openUpdate}
        closeUpdateEmployee={() =>
          setIsOpenEmployee({
            openUpdate: false,
            employee: null,
            openDelete: false,
          })
        }
      />
      <DeleteEmployee
        isOpenDeleteEmployee={isOpenEmployee.openDelete}
        closeDeleteEmployee={() =>
          setIsOpenEmployee({
            openDelete: false,
            employee: null,
            openUpdate: false,
          })
        }
      />
      <NewRoleModal isOpen={isOpenAddRole} onClose={closeAddRole} />
    </div>
  );
};

export default Page;
