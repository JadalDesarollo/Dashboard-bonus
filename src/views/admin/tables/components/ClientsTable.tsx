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
function ClientsTable() {
  const { fetchClients } = useTransactionContext()
  const [isLoading, setisLoading] = useState<boolean>(false)
  const [data, setData] = useState<ClientsData[]>([])
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
          {info.getValue() == "" ? 'No registrado' : info.getValue()}
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
              className="bg-brand-500 text-white px-7 py-1 rounded-md mr-2 w-13" >
              exitosas
            </button>
          </Link>

          <Link to={`/admin/clientes/pendientes/${info.getValue()}`}>
            <button
              className="bg-red-400 text-white px-8 py-1 rounded-md mr-2 w-35 mt-2 lg:mt-0 " >
              pendientes
            </button>
          </Link>


        </>
      ),
    }),

  ];
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [documentFilter, setDocumentFilter] = React.useState<string>("");
  const [loyaltyFilter, setLoyaltyFilter] = React.useState<string>("");
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
  const filterData = async (e: any) => {
    e.preventDefault();
    let filteredData = [];
    const { data } = await fetchClients();

    if (nameFilter.trim() === "" && documentFilter.trim() === "" && loyaltyFilter.trim() === "") {
      getClients();
      return;
    }

    if (nameFilter.trim() !== "" && documentFilter.trim() !== "") {
      // Si ambos campos (nombres y documentos) están llenos, buscar por ambos
      filteredData = data.filter((row: ClientsData) => {
        const nameMatch = row.nombres?.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
        const documentMatch = row.documento?.toLocaleLowerCase().includes(documentFilter.toLocaleLowerCase());
        return nameMatch && documentMatch;
      });
    } else {
      // Si al menos uno de los campos (nombres o documentos) está lleno, buscar por ese campo
      filteredData = data.filter((row: ClientsData) => {
        const nameMatch = nameFilter !== "" && row.nombres?.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
        const documentMatch = documentFilter !== "" && row.documento?.toLocaleLowerCase().includes(documentFilter.toLocaleLowerCase());
        const loyaltyMatch = loyaltyFilter !== "" && row.tarjeta_loyalty?.slice(-4) === loyaltyFilter; // Filtra por los últimos 4 dígitos

        return nameMatch || documentMatch || loyaltyMatch;
      });
    }

    setData(filteredData);
  };

  return (
    <Card extra={"w-full pb-10 p-4 h-full mt-6"}>
      <form className="flex gap-4 flex-wrap" onSubmit={filterData}>
        <InputField id="filter-search" type="search" label="Nombres" placeholder="Ingrese nombres" variant="none" extra="basis-80 grow md:grow-0"
          onChange={(e) => {
            setNameFilter(e.target.value);
            setIsFormValid(Boolean(e.target.value) || Boolean(documentFilter))
          }}
        />
        <InputField id="filter-search" type="search" label="Nro Documento" placeholder="Ingrese Nro Documento" variant="none" extra="basis-80 grow md:grow-0"
          onChange={(e) => {
            setDocumentFilter(e.target.value);
          }}
        />

        <InputField
          id="filter-search-loyalty"
          type="search"
          label="Tarjeta de fidelidad"
          placeholder="Ingrese los últimos 4 dígitos"
          variant="none"
          extra="basis-80 grow md:grow-0"
          onChange={(e) => {
            setLoyaltyFilter(e.target.value);
          }}
        />

        <button
          type="submit"
          className={`text-white px-8 py-1 rounded-md h-14 self-end first-letter
          bg-brand-500 w-full md:w-auto
              `}
        >
          Buscar
        </button>
      </form>

      {
        isLoading ? <div className="text-start mb-6 mt-9 ml-80">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
          : null
      }

      {
        !isLoading && data.length > 0 ?
          <>
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


            </div>
            <hr />
            <div className="flex flex-wrap  gap-5 justify-center lg:justify-start items-center pt-4">
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
                  value={Math.max(1, Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 1))}
                  onChange={(e) => {
                    const page = e.target.value ? Math.max(1, Math.min(table.getPageCount(), Number(e.target.value))) - 1 : 0;
                    table.setPageIndex(page);
                  }}
                  className=" p-1 rounded w-16 dark:bg-gray-800"
                />
              </span>
              <select
                className="dark:bg-gray-800 p-1 rounded flex items-center"
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
              <span>
                Cantidad de clientes: <strong>{data.length}</strong>
              </span>
            </div>

          </> : null
      }
      {
        !isLoading && data.length <= 0 ?
          <p className="text-sm text-red-700 dark:text-white pl-3 mt-2">
            No se encontraron clientes registrados
          </p> : null
      }

    </Card>
  );
}
export default ClientsTable;
const columnHelper = createColumnHelper<ClientsData>();
