import { format } from "date-fns";
import React, { createContext, useContext, useState, useEffect } from "react";
import reportService from "services/ReportService";
import { useNavigate } from "react-router-dom";
import ReportService from "services/ReportService";
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
    descargarExcel: (dataFilter: any) => void;

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
    const descargarExcel = async (dataFilter: any) => {
        try {
            await ReportService.generateAndDownloadEXCEL(dataFilter)
        } catch (error: any) {
            console.error('Error al descargar el archivo Excel:', error.message);
            // Manejar errores
        }
    };
    const fetchTransactions = async (dataFilter: any) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/listAccumulate`,
                {
                    method: 'POST',  // Puedes ajustar el método según las necesidades de tu API
                    headers: {
                        'Content-Type': 'application/json',
                        // Puedes agregar más encabezados según las necesidades de tu API
                    },
                    body: JSON.stringify(dataFilter),
                }
            );

            const data = await response.json();
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
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/listAccumulate/${idClient}`
            );
            if (!response.ok) {
                return {
                    estado: false
                }
            }
            const data = await response.json();
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
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/listClients`
            );
            const data = await response.json();
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
    /* const exchangeWithLoyalty = async (formData: any): Promise<ExchangeWithLoyaltyResponse> => {
        try {
            const response = await fetch("http://192.168.18.25:3003/api-bonus/exchange/card", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
 
            if (response.ok) {
                fetchTransactionData()
                return {
                    estado: true
                }
            } else {
                const errorData = await response.json();
                return {
                    estado: false,
                    error: errorData.error
                }
            }
        } catch (error) {
            return {
                estado: false,
                error: error as string
            }
        }
    }; */
    const fetchTransactionsPending = async (idClient: number): Promise<FunctionResponse> => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/transactionPending/${idClient}`
            );
            if (!response.ok) {
                return {
                    estado: false
                }
            }
            const data = await response.json();
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
    /*     useEffect(() => {
            fetchTransactionData()
        }, []) */
    return (
        <TransactionContext.Provider value={{ transactionData, isLoading, fetchClients, fetchTransactionsByClient, fetchTransactionsPending, fetchTransactions, generatePDF, descargarExcel }}>
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
