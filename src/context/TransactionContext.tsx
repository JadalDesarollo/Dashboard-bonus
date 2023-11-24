import { format } from "date-fns";
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
            const response = await fetch(
                "http://192.168.18.25:3003/api-bonus/generar-pdf",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataFilter),
                }
            );

            if (response.ok) {
                // Si la solicitud es exitosa, descarga el PDF
                await descargarPDF(response);
                return {
                    estado: true,
                };
            } else {
                // Si hay un error en la respuesta, maneja el error
                console.error('Error en la generación del PDF:', response.statusText);
                return {
                    estado: false,
                };
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return {
                estado: false,
            };
        }
    };

    const descargarPDF = async (response: Response) => {
        try {
            const fileName = `${format(
                new Date(),
                "dd_MM_yyyy"
            )}_REPORTE-TRANSACCIONES-BONUS.pdf`;
            if (!response.ok) {
                throw new Error(`Error al descargar el PDF: ${response.statusText}`);
            }

            // Obtener el contenido del PDF como un blob
            const blob = await response.blob();

            // Crear una URL del blob
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace <a> invisible para descargar el PDF
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;

            // Agregar el enlace al DOM y hacer clic en él
            document.body.appendChild(a);
            a.click();

            // Limpiar después de la descarga
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            console.error('Error al descargar el PDF:', error.message);
            // Manejar errores
        }
    };

    const descargarExcel = async (dataFilter: any) => {
        try {
            const fileName = `${format(
                new Date(),
                "dd_MM_yyyy"
            )}_REPORTE-TRANSACCIONES-BONUS.xlsx`;
            const response = await fetch('http://192.168.18.25:3003/api-bonus/generar-excel', {
                method: 'POST',  // Cambié el método a 'POST'
                headers: {
                    'Content-Type': 'application/json',
                    // Otros encabezados según sea necesario
                },
                body: JSON.stringify(dataFilter),  // Envía el dataFilter en el cuerpo
            });

            if (!response.ok) {
                throw new Error('Error al descargar el archivo Excel');
            }

            // Convertir la respuesta a un blob (formato binario)
            const blob = await response.blob();

            // Crear una URL del blob
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace <a> invisible para descargar el archivo Excel
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;

            // Agregar el enlace al DOM y hacer clic en él
            document.body.appendChild(a);
            a.click();

            // Limpiar después de la descarga
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            console.error('Error al descargar el archivo Excel:', error.message);
            // Manejar errores
        }
    };
    const fetchTransactions = async (dataFilter: any) => {
        try {
            const response = await fetch(
                "http://192.168.18.25:3003/api-bonus/listAccumulate",
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
