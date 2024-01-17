import { format } from "date-fns";

const generateAndDownloadPDF = async (dataFilter: any) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/generar-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataFilter),
      }
    );
    if (response.ok) {
      await descargarPDF(response);
      return {
        estado: true,
      };
    } else {
      console.error("Error en la generación del PDF:", response.statusText);
      return {
        estado: false,
      };
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
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
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error: any) {
    console.error("Error al descargar el PDF:", error.message);
  }
};
const generateAndDownloadEXCEL = async (dataFilter: any) => {
  try {
    const token = localStorage.getItem("token") || "";
    const fileName = `${format(
      new Date(),
      "dd_MM_yyyy"
    )}_REPORTE-TRANSACCIONES-BONUS.xlsx`;
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/generar-excel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataFilter),
      }
    );

    if (!response.ok) {
      throw new Error("Error al descargar el archivo Excel");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return {
      estado: true,
    };
  } catch (error: any) {
    console.error("Error al descargar el archivo Excel:", error.message);
    return {
      estado: false,
    };
  }
};
export default { generateAndDownloadPDF, generateAndDownloadEXCEL };
