import React, { useEffect, useState } from "react";
import LogoBack from "../../../../assets/svg/back-arrow.svg"
import Card from "components/card";
import LogoExcel from "../../../../assets/svg/excel-logo.svg"
import LogoPDF from "../../../../assets/svg/pdf-logo.svg"
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
import { useNavigate, useParams } from "react-router-dom";

import { addHours, format, parseISO } from "date-fns";
import Report from '../../../../services/ReportService'
import Swal from "sweetalert2";
import { es } from "date-fns/locale";

export interface TransactionClient {
    id: number;
    posSequential: string;
    codigo_comercio: string;
    fecha_transaccion: string;
    numero_comprobante: string;
    saldo_puntos: number;
    saldo_dinero: number;
    tipo: string;
    puntos: string;
}
function TransactionClient() {
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [cliente, setCliente] = useState(null)
    const [data, setData] = useState<TransactionClient[]>([])
    const navigate = useNavigate()
    const params = useParams()
    const idClient = Number(params.id)
    const { fetchTransactionsByClient } = useTransactionContext()

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [searchParams, setSearchParams] = useState({
        fecha_transaccion_desde: "",
        fecha_transaccion_hasta: "",
        tipo: "",

    });
    const getTransactions = async () => {
        setisLoading(true)
        const responseTransaction = await fetchTransactionsByClient(idClient, searchParams)

        console.log(responseTransaction.estado)
        if (!responseTransaction.estado) {
            navigate('/admin/clientes')
            return
        }
        setData(responseTransaction?.data)
        setCliente(responseTransaction?.cliente)
        setisLoading(false)
    }
    useEffect(() => {
        getTransactions()
    }, [])
    const isExistData = (): boolean => {
        return data.length > 0
    }
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
                    NRO COMPROBANTE
                </p>
            ),
            cell: (info) => (
                <p className="text-sm font-light text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("codigo_comercio", {
            id: "quantity",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">
                    CODIGO COMERCIO
                </p>
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
                <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO TRANSACCION</p>
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
                <p className="text-sm font-bold text-gray-600 dark:text-white">PUNTOS</p>
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
                <p className="text-sm font-bold text-gray-600 dark:text-white">FECHA TRANSACCION</p>
            ),

            cell: (info) => {
                const raw = String(info.getValue());
                const d = parseISO(raw);             
                const adj = addHours(d, 5);         
                return (
                    <p className="text-sm font-light text-navy-700 dark:text-white">
                        {format(adj, 'dd MMM yyyy HH:mm:ss', { locale: es })}
                    </p>
                );
            }

        }),

        columnHelper.accessor("saldo_puntos", {
            id: "saldo_puntos",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">SALDO PUNTOS</p>
            ),
            cell: (info) => (
                <p className="text-sm font-light text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),

        columnHelper.accessor("saldo_dinero", {
            id: "saldo_dinero",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">SALDO DINERO</p>
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
    const [nameFilter, setNameFilter] = React.useState<string>("");
    const [documentFilter, setDocumentFilter] = React.useState<string>("");
    const [isFormValid, setIsFormValid] = React.useState<boolean>(false);
    const [showMessage, setShowMessage] = useState(false);

    const getGeneratePDF = async (e: any) => {
        if (!isExistData()) {
            return
        }
        const { estado } = await Report.generateAndDownloadPDFbyClient({ ...searchParams, id_cliente: idClient });
        if (estado) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    const icon = toast.querySelector('.swal2-icon') as HTMLElement;
                    if (icon) {
                        icon.style.backgroundColor = '#303030';
                    }

                    toast.style.backgroundColor = '#444444'; // Reemplaza con el color de fondo que deseas
                    toast.style.color = '#eeebeb'; // Reemplaza con el color de texto que deseas
                },
                customClass: {
                    popup: "your-custom-class", // Agrega una clase CSS personalizada aquí
                },
            });

            Toast.fire({
                icon: "success",
                title: "Reporte PDF generado",
            });
        }
    }
    const getGenerateExcel = async (e: any) => {
        if (!isExistData()) {
            return
        }
        const { estado } = await Report.generateAndDownloadEXCELByClient({ ...searchParams, id_cliente: idClient }
        );
        if (estado) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    const icon = toast.querySelector('.swal2-icon') as HTMLElement;
                    if (icon) {
                        icon.style.backgroundColor = '#303030';
                    }

                    toast.style.backgroundColor = '#444444'; // Reemplaza con el color de fondo que deseas
                    toast.style.color = '#eeebeb'; // Reemplaza con el color de texto que deseas
                },
                customClass: {
                    popup: "your-custom-class", // Agrega una clase CSS personalizada aquí
                },
            });

            Toast.fire({
                icon: "success",
                title: "Reporte EXCEL generado",
            });

        }
    }
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
    if (isNaN(idClient) || idClient < 0) {
        navigate('/admin/clientes')
        return
    }

    const filterData = async (e: any) => {
        e.preventDefault();
        setShowMessage(true);
        const fecha_transaccion_desde = e.target.elements.fechaDesde.value;
        const fecha_transaccion_hasta = e.target.elements.fechaHasta.value;
        const tipo = e.target.elements.tipo.value;

        setSearchParams({
            fecha_transaccion_desde,
            fecha_transaccion_hasta,
            tipo
        });
        const { data } = await fetchTransactionsByClient(idClient, {
            fecha_transaccion_desde,
            fecha_transaccion_hasta,
            tipo
        })

        setData(data ?? []);

    }

    return (
        <Card extra={"w-full pb-10 p-4 h-full mt-6 "}>
            <div className="pb-3 flex">
                <label
                    htmlFor={"tets"}
                    className={`text-sm text-navy-700 dark:text-white ml-3 font-bold
                    }`}
                >
                    Cliente:

                    <label
                        htmlFor={"tets"}
                        className={`text-sm text-navy-700 dark:text-white ml-3 font-light
                    }`}
                    >
                        {cliente?.nombres}
                    </label>
                </label>

                <label
                    htmlFor={"tets"}
                    className={`text-sm text-navy-700 dark:text-white ml-3 font-bold
                    }`}
                >
                    Documento:

                    <label
                        htmlFor={"tets"}
                        className={`text-sm text-navy-700 dark:text-white ml-3 font-light
                    }`}
                    >{cliente?.documento == "" ? 'No registrado' : cliente?.documento}
                    </label>
                </label>
            </div>
            <form className="flex  gap-4 flex-wrap" onSubmit={filterData}>
                <InputField id="filter-search" type="date" label="Fecha Desde" placeholder="Ingrese nombres" variant="none"
                    extra={`basis-80 grow md:grow-0 align text-left w-full`}
                    name="fechaDesde"
                //  state={isFormValid}
                //value={fechaDesde}
                //onChange={(e) => setFechaDesde(e.target.value)}
                //max={fechaHasta}
                />
                <InputField id="filter-search" type="date" label="Fecha Hasta" placeholder="Buscar" variant="none" extra="basis-80 grow md:grow-0 "
                    name="fechaHasta"
                //onChange={(e) => setFechaHasta(e.target.value)}
                //value={fechaHasta}
                //min={fechaDesde} // Restringe la fecha hasta la fecha desde


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
                <button
                    type="submit"
                    className={`text-white px-10 py-2 rounded-md h-12 self-start first-letter bg-brand-500 w-full md:w-auto grow md:grow-0 md:mt-9 xl:mt-auto
              `}
                >
                    Buscar
                </button>
                <button
                    className={`text-white px-8 py-1 rounded-md h-14 self-end first-letter w-full md:w-auto grow md:grow-0 ml-auto
              `}
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    <img className="inline fill-white" src={LogoBack} alt="" />

                </button>

            </form>

            <div className="mt-3  xl:overflow-x-hidden">

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
                            <div className="flex flex-col ">
                                <hr className="my-3" />
                                <div className="flex gap-3 mb-2">
                                    <span className="text-4 text-navy-700 dark:text-white ml-3 font-bold mt-4">Exportar:</span>

                                    <button

                                        type="button"
                                        onClick={getGeneratePDF}
                                        className={`text-white px-8 py-1 rounded-md h-10 self-end first-letter bg-orange-800 w-full md:w-auto text-[14px] lg:text-auto grow md:grow-0`}
                                    >
                                        PDF   <img className="inline" src={LogoPDF} alt="" />
                                    </button>
                                    <button

                                        onClick={getGenerateExcel}
                                        type="button"
                                        className={`text-white px-7 py-1 rounded-md h-10 self-end first-letter bg-green-800 w-full md:w-auto text-[14px] grow md:grow-0 }`}
                                    >Excel
                                        <img className="inline" src={LogoExcel} alt="" />

                                    </button>
                                </div>
                                <div className="overflow-x-scroll md:overflow-x-hidden">
                                    <table className="w-full transition duration-10000 ease-in-out">
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
                                                                        className=" border-white/0 py-2 pr-4 "
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
                                        Cantidad de transacciones realizadas: <strong>{data.length}</strong>
                                    </span>
                                </div>
                            </div>
                        </> : null
                }
                {
                    !isLoading && data.length <= 0 ?
                        <p className="text-sm text-red-700 dark:text-red-300 pl-3">
                            No se encontraron movimientos registrados
                        </p> : null
                }
            </div>
        </Card>
    );
}

export default TransactionClient;
const columnHelper = createColumnHelper<TransactionClient>();
