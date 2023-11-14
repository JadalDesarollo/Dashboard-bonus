import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
}
const TransactionContext = createContext<BonusContextType | undefined>(undefined);
export const TransactionProvider: React.FC<{
    children?: React.ReactNode;
}> = ({ children }: { children?: React.ReactNode }) => {
    const [transactionData, setBonusData] = useState<Transaction[] | null>(null);
    const [isLoading, setisLoading] = useState(true)

    /*     const fetchTransactionData = async () => {
            try {
                const response = await fetch(
                    "http://192.168.18.25::3003/api-bonus/listAccumulate"
                );
                const data = await response.json();
                setBonusData(data.data);
                setisLoading(false)
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        }; */
    const fetchTransactionsByClient = async (idClient: number): Promise<FunctionResponse> => {
        try {
            const response = await fetch(
                `http://192.168.18.25:3003/api-bonus/listAccumulate/${idClient}`
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
                "http://192.168.18.25:3003/api-bonus/listClients"
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
                `http://192.168.18.25:3003/api-bonus/transactionPending/${idClient}`
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
        <TransactionContext.Provider value={{ transactionData, isLoading, fetchClients, fetchTransactionsByClient, fetchTransactionsPending }}>
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
