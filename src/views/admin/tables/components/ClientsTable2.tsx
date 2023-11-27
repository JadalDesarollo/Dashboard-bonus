import React, { useEffect, useState } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import LogoExcel from "../../../../assets/svg/excel-logo.svg"
import LogoPDF from "../../../../assets/svg/pdf-logo.svg"
import iconExport from "../../../../assets/svg/exportar-logo.svg"
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
import { set } from "date-fns";

interface Transaccion {
  id: number;
  numero_comprobante: string;
  codigo_comercio: string;
  monto: number;
  puntos: number;

  tarjeta_loyalty: string;
  pos_id: string;
  fecha_transaccion: string;
  tipo: string;
}
function ClientsTable2() {
  const { fetchTransactions, generatePDF, descargarExcel } = useTransactionContext()
  const [isLoading, setisLoading] = useState<boolean>(false)
  const [showMessage, setShowMessage] = useState(false);
  const [data, setData] = useState<Transaccion[]>([])
  const [isFormValid, setIsFormValid] = useState(true)
  const [searchParams, setSearchParams] = useState({
    fecha_transaccion_desde: "",
    fecha_transaccion_hasta: "",
    tipo: "",
    codigo_comercio: "",
    pos_id: "",
  });
  const getClients = async (dataFilter: any) => {
    setisLoading(true)
    const { data } = await fetchTransactions(dataFilter)
    setisLoading(false)
    setData(data ?? [])
  }
  const isExistData = (): boolean => {
    return data.length > 0
  }


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
    columnHelper.accessor("numero_comprobante", {
      id: "progress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Numero comprobante
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("codigo_comercio", {
      id: "codigo_comercio",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Código comercio
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("monto", {
      id: "monto",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Monto</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("puntos", {
      id: "puntos",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Monto</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("tipo", {
      id: "tipo",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Tipo</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("tarjeta_loyalty", {
      id: "tarjeta_loyalty",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Tarjeta</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("pos_id", {
      id: "pos_id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">PosID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),

    columnHelper.accessor("fecha_transaccion", {
      id: "fecha_transaccion",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">fecha transaccion</p>
      ),
      cell: (info) => (
        <p className="text-sm font-light text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),




  ];
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
  const getGeneratePDF = async (e: any) => {
    if (!isExistData()) {
      return
    }
    await generatePDF(searchParams);
  }
  const getGenerateExcel = async (e: any) => {
    if (!isExistData()) {
      return
    }
    await descargarExcel(searchParams);
  }
  const filterData = async (e: any) => {
    e.preventDefault();
    setShowMessage(true)
    const fecha_transaccion_desde = e.target.elements.fechaDesde.value;
    const fecha_transaccion_hasta = e.target.elements.fechaHasta.value;
    if (fecha_transaccion_desde == "" && fecha_transaccion_hasta == "") {
      setData([])
      return setIsFormValid(false)
    }
    setIsFormValid(true)
    const tipo = e.target.elements.tipo.value;
    const codigo_comercio = e.target.elements.codigoComercio.value;
    const pos_id = e.target.elements.posId.value;
    setSearchParams({
      fecha_transaccion_desde,
      fecha_transaccion_hasta,
      tipo,
      codigo_comercio,
      pos_id
    });
    await getClients({
      fecha_transaccion_desde,
      fecha_transaccion_hasta,
      tipo,
      codigo_comercio,
      pos_id
    });

  }

  return (
    <Card extra={"w-full pb-10 p-4 h-full mt-6 "}>
      <form className="flex  gap-4 flex-wrap" onSubmit={filterData}>
        <InputField id="filter-search" type="date" label="Fecha Desde" placeholder="Ingrese nombres" variant="none"
          extra={`basis-80 grow md:grow-0`}
          name="fechaDesde"
          state={isFormValid}
        />
        <InputField id="filter-search" type="date" label="Fecha Hasta" placeholder="Buscar" variant="none" extra="basis-80 grow md:grow-0 "
          name="fechaHasta"

        />
        <div className="basis-80 grow md:grow-0">
          <label
            className="Dtext-sm text-navy-700 dark:text-white ml-3 font-bold"
          >Tipo</label>
          <select className="mt-2 flex h-14 w-full items-center justify-center border dark:border-none rounded-xl bg-white/0 p-3 text-sm outline-none dark:bg-gray-800 dark:border-gray-600"
            name="tipo">

            <option value="">TODOS</option>
            <option value="CANJE">CANJE</option>
            <option value="ACUMULACION">ACUMULACION</option>
            <option value="EXTORNO">EXTORNO</option>
          </select>
        </div>

        <InputField id="filter-search" type="search" label="Còdigo comercio" placeholder="Buscar" variant="none" extra="basis-80 grow md:grow-0" name="codigoComercio"

        />
        <InputField id="filter-search" type="search" label="Pos ID" placeholder="Buscar" variant="none" extra="basis-80 grow md:grow-0" name="posId"

        />

        <button
          type="submit"
          className={`text-white px-10 py-2 rounded-md h-12 self-start first-letter
          bg-brand-500 w-full md:w-auto
          grow md:grow-0 md:mt-9 xl:mt-auto
              `}
        >
          Buscar
        </button>
        {
          !isFormValid ?
            <p className="text-sm text-red-400 dark:text-red pl-3 mt-4">
              Ingrese un rango de fecha
            </p> : null
        }

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
          <div className="flex flex-col ">
            <hr className="my-3" />
            <div className="flex gap-3 ">
              <span className="text-4 text-navy-700 dark:text-white ml-3 font-bold mt-4">Exportar:</span>

              <button
                disabled={!isExistData()}
                type="button"
                onClick={getGeneratePDF}
                className={`text-white px-8 py-1 rounded-md h-10 self-end first-letter
bg-orange-800 w-full md:w-auto
grow md:grow-0 ${!isExistData() ? 'bg-gray-500 dark:bg-gray-700 cursor-not-allowed' : ''}
  `}
              >
                PDF   <img className="inline" src={LogoPDF} alt="" />
              </button>
              <button
                disabled={!isExistData()}
                onClick={getGenerateExcel}
                type="button"
                className={`text-white px-7 py-1 rounded-md h-10 self-end first-letter
bg-green-800 w-full md:w-auto
grow md:grow-0 ${!isExistData() ? 'bg-gray-500 dark:bg-gray-700 cursor-not-allowed' : ''}
  `}
              >Excel
                <img className="inline" src={LogoExcel} alt="" />

              </button>
            </div>
            <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
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
                <span>
                  Cantidad de transacciones: <strong>{data.length}</strong>
                </span>
              </div>
            </div>


          </div> : null
      } 
      {
        showMessage && !isExistData() && isFormValid && !isLoading ?
          <p className="text-sm text-red-400 dark:text-white pl-3 mt-5">
            No se encotraron datos para el registro de operaciones
          </p> : null
      }

    </Card>
  );
}

export default ClientsTable2;
const columnHelper = createColumnHelper<Transaccion>();
