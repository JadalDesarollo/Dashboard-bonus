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
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { is } from "date-fns/locale";

export interface TransactionPending {
    id: number;
    commerceCode: string;
    identifier: string;
    nroVoucher: string,
    identifierType: number;
    transactionDate: string;
    posId: string;
    posSequential: string;
    totalAmount: number;
    transactionDetails: {
        productCode: string;
        productQuantity: number;
        productDescription: string;
        productTotalAmount: number;
    }[];
    mensajeError: string;
    createdAt: string;
    updatedAt: string;
}
function TransactionPending() {

    const [isLoading, setisLoading] = useState<boolean>(false)
    const [cliente, setCliente] = useState(null)
    const [data, setData] = useState<TransactionPending[]>([])
    const navigate = useNavigate()
    const params = useParams()
    const idClient = Number(params.id)
    const { fetchTransactionsPending } = useTransactionContext()

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const getTransactions = async () => {
        setisLoading(true)
        const responseTransaction = await fetchTransactionsPending(idClient)
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
        columnHelper.accessor("nroVoucher", {
            id: "nroVoucher",
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
        columnHelper.accessor("commerceCode", {
            id: "commerCode",
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
        columnHelper.accessor("transactionDate", {
            id: "transactionDate",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">FECHA TRANSACCION</p>
            ),
            cell: (info) => (
                <p className="text-sm font-light text-navy-700 dark:text-white">
                    {format(parseISO(info.getValue()), 'dd MMM yyyy HH:mm:ss')}
                </p>
            ),
        }),


        columnHelper.accessor("totalAmount", {
            id: "totalAmount",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">MONTO TOTAL</p>
            ),
            cell: (info) => (
                <p className="text-sm font-light text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),

        columnHelper.accessor("mensajeError", {
            id: "mensajeError",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">MOTIVO</p>
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
    if (isNaN(idClient) || idClient < 0) {

        navigate('/admin/clientes')
        return
    }
    return (
        <Card extra={"w-full pb-10 p-4 h-full mt-6"}>
            <div className="pb-3">
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
                    >{cliente?.documento}
                    </label>
                </label>

            </div>
            {

            }
            {
                !isLoading && data.length > 0 ?
                    <div className="mt-3 overflow-x-scroll xl:overflow-x-hidden">
                        <div className="flex gap-4 pb-3">
                            <InputField id="filter-search" type="date" label="fecha" placeholder="Ingrese nro comprobante" variant="none" extra="basis-80"
                                onChange={(e) => {
                                    setNameFilter(e.target.value);
                                    setIsFormValid(Boolean(e.target.value) || Boolean(documentFilter))
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (nameFilter.trim() === "" && documentFilter.trim() === "") {
                                        getTransactions()
                                        return
                                    }
                                    const filteredData = data.filter((row: TransactionPending) => {
                                        const nameMatch = nameFilter !== "" && row.transactionDate?.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());

                                        return nameMatch;
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
                    </div> : <p className="text-sm text-green-700 dark:text-white pl-3">
                        Sin transacciones pendientes
                    </p>
            }

        </Card>
    );
}

export default TransactionPending;
const columnHelper = createColumnHelper<TransactionPending>();
