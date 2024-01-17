import { format } from "date-fns";
import React, { createContext, useContext, useState, useEffect } from "react";
import reportService from "services/ReportService";
import { useNavigate } from "react-router-dom";
import ReportService from "services/ReportService";
import { fetchConToken } from "helpers/fetch";
interface Transaction {
    id: number;
    codigo_comercio: string;
    saldo_puntos: number;
    saldo_dinero: number;
    tipo: string;
    fecha_transaccion: string;
    bonus_cliente: {
        nombres: string;
        documento: string
    };
}
interface ExchangeWithLoyaltyResponse {
    estado: boolean,
    error?: string
}
interface FunctionResponse {
    estado: boolean,
    data?: any
    cliente?: any
}
interface BonusContextType {
    transactionData: Transaction[] | null;
    isLoading: boolean;
    fetchClients: () => Promise<FunctionResponse>;
    fetchTransactionsByClient: (idClient: number) => Promise<FunctionResponse>;
    fetchTransactionsPending: (idClient: number) => Promise<FunctionResponse>;
    fetchTransactions: (dataFilter: any) => Promise<FunctionResponse>;
    generatePDF: (dataFilter: any) => Promise<FunctionResponse>;
    generateExcel: (dataFilter: any) => Promise<FunctionResponse>;

}
const TransactionContext = createContext<BonusContextType | undefined>(undefined);
export const TransactionProvider: React.FC<{
    children?: React.ReactNode;
}> = ({ children }: { children?: React.ReactNode }) => {
    const [transactionData, setBonusData] = useState<Transaction[] | null>(null);
    const [isLoading, setisLoading] = useState(true)
    const generatePDF = async (dataFilter: any) => {
        try {
            const { estado } = await reportService.generateAndDownloadPDF(dataFilter)
            return {
                estado
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return {
                estado: false,
            };
        }
    };
    const generateExcel = async (dataFilter: any): Promise<FunctionResponse> => {
        try {
            const { estado } = await ReportService.generateAndDownloadEXCEL(dataFilter)
            return {
                estado
            }
        } catch (error: any) {
            console.error('Error al descargar el archivo Excel:', error.message);
            return {
                estado: false
            }
        }
    };
    const fetchTransactions = async (dataFilter: any) => {
        try {
            const data = await fetchConToken(
                `listAccumulate`, 'POST',
                dataFilter,

            );


            console.log(data)
            return {
                estado: true,
                data: data.data,
                cliente: data.cliente
            }
        } catch (error) {
            console.log(error)
            return {
                estado: false,
            }
        };
    }
    const fetchTransactionsByClient = async (idClient: number): Promise<FunctionResponse> => {
        try {
            const data = await fetchConToken(
                `listAccumulate/${idClient}`
            );

            return {
                estado: true,
                data: data.data,
                cliente: data.cliente
            }
        } catch (error) {
            return {
                estado: false
            }
        }
    }
    const fetchClients = async (): Promise<FunctionResponse> => {
        try {
            const data = await fetchConToken(
                `listClients`
            );

            return {
                estado: true,
                data: data.data
            }
        } catch (error) {
            return {
                estado: false
            }
        }
    }

    const fetchTransactionsPending = async (idClient: number): Promise<FunctionResponse> => {
        try {
            const data = await fetchConToken(
                `transactionPending/${idClient}`
            );
            return {
                estado: true,
                data: data.data,
                cliente: data.cliente
            }
        } catch (error) {
            return {
                estado: false
            }
        }
    }
    return (
        <TransactionContext.Provider value={{ transactionData, isLoading, fetchClients, fetchTransactionsByClient, fetchTransactionsPending, fetchTransactions, generatePDF, generateExcel }}>
            {children}
        </TransactionContext.Provider>
    );
};
export const useTransactionContext = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error("useBonus debe ser utilizado dentro de un BonusProvider");
    }
    return context;
};
