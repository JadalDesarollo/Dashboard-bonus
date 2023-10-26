import React, { useEffect, useState } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import InputField from "components/fields/InputField";
import { useTransactionContext } from "context/TransactionContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface ClientsData {
  id: number,
  nombres: string;
  tarjeta_loyalty: string;
  documento: string
  transacciones: string;
}
function ColumnsTable(props: { tableData: any }) {
  const { fetchClients } = useTransactionContext()
  const [isLoading, setisLoading] = useState<boolean>(false)

  const [data, setData] = useState<ClientsData[]>([])
  const navigate = useNavigate()
  const getClients = async () => {
    setisLoading(true)
    const { data } = await fetchClients()
    setisLoading(false)
    setData(data ?? [])
  }
  useEffect(() => {
    getClients()
  }, [])

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = [
    columnHelper.accessor("id", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("nombres", {
      id: "progress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          NOMBRES
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("documento", {
      id: "quantity",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          DOCUMENTO
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("tarjeta_loyalty", {
      id: "date",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">TARJETA LOYALTY</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("id", {
      id: "transacciones",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Transacciones</p>
      ),
      cell: (info) => (
        <>
          <Link to={`/admin/clientes/${info.getValue()}`}>
            <button

              className="bg-brand-500 text-white px-8 py-1 rounded-md mr-2" >
              ver
            </button>
          </Link>

          <Link to={`/admin/clientes/pendientes/${info.getValue()}`}>
            <button

              className="bg-red-400 text-white px-8 py-1 rounded-md mr-2" >
              ...
            </button>
          </Link>

  
        </>
      ),
    }),

  ];


  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [documentFilter, setDocumentFilter] = React.useState<string>("");
  const [isFormValid, setIsFormValid] = React.useState<boolean>(false);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: (newPagination) => setPagination(newPagination),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={"w-full pb-10 p-4 h-full mt-6"}>
      <div className="flex gap-4 ">
        <InputField id="filter-search" type="search" label="Nombres" placeholder="Ingrese nombres" variant="none" extra="basis-80"
          onChange={(e) => {
            setNameFilter(e.target.value);
            setIsFormValid(Boolean(e.target.value) || Boolean(documentFilter))
          }}
        />
        <InputField id="filter-search" type="search" label="Nro Documento" placeholder="Buscar" variant="none" extra="basis-80"
          onChange={(e) => {
            setDocumentFilter(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (nameFilter.trim() === "" && documentFilter.trim() === "") {
              getClients()
              return
            }
            const filteredData = data.filter((row: ClientsData) => {
              const nameMatch = nameFilter !== "" && row.nombres?.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
              const documentMatch = documentFilter !== "" && row.documento?.toLocaleLowerCase().includes(documentFilter.toLocaleLowerCase());
              return nameMatch || documentMatch;
            });
            console.log(filteredData);
            setData(filteredData);
          }}
          className={`text-white px-8 py-1 rounded-md h-12 self-end first-letter
          bg-brand-500
              `}
        >

          Buscar
        </button>
      </div>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-center  text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, pagination.pageSize)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className=" border-white/0 py-2 pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>

                );
              })}

          </tbody>
        </table>
        {/* Paginación */}
        <div className=" outline outline-1 outline-gray-200 flex gap-5 justify-start items-center pt-4">
          {/*     <button
            onClick={() => {
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>{" "} */}
          <button
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            {">"}
          </button>{" "}
          {/*           <button
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1); // Ir a la última página
            }}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>{" "} */}
          <span>
            Página{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </strong>{" "}
          </span>
          <span className="flex items-center gap-3">
            Ir a:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className=" p-1 rounded w-16 dark:bg-gray-800"
            />
          </span>
          <select
            className="dark:bg-gray-800"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20].map((pageSize) => (
              <option
                className="appearance-none"
                key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

export default ColumnsTable;
const columnHelper = createColumnHelper<ClientsData>();
