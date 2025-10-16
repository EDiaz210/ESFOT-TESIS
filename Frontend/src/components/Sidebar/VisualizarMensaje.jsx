import React from "react";
import {
  PaperClipIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const VisualizarMensaje = ({ mensaje, onClose }) => {
  if (!mensaje) return null;

  // Permite mostrar saltos de línea del texto real
  const formatearTexto = (texto) =>
    texto
      .split("\n")
      .map((linea, i) => (
        <p key={i} className="mb-2 text-gray-200 leading-relaxed">
          {linea.trim()}
        </p>
      ));

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 p-6">
      {/* Header superior */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-lg font-bold text-[#20B2AA] flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-[#20B2AA]" />
          Mensaje seleccionado
        </h2>
        <button
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-md text-sm hover:bg-gray-700 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Contenedor del mensaje */}
      <div className="bg-gray-800 rounded-lg p-5 flex-1 overflow-y-auto shadow-inner">
        {/* Encabezado tipo correo */}
        <div className="border-b border-gray-700 pb-3 mb-4 text-sm">
          <div className="mb-1">
            <strong className="text-gray-300">De:</strong>{" "}
            <span className="text-gray-200">
              {mensaje.sender || "Remitente desconocido"}
            </span>
          </div>
          <div className="mb-1">
            <strong className="text-gray-300">Para:</strong>{" "}
            {mensaje.numbers?.length > 0
              ? mensaje.numbers.join(", ")
              : "Sin destinatarios"}
          </div>
          {mensaje.asunto && (
            <div className="mb-1">
              <strong className="text-gray-300">Asunto:</strong>{" "}
              {mensaje.asunto}
            </div>
          )}
          <div className="text-gray-500">
            {new Date(mensaje.date).toLocaleString("es-EC", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </div>
        </div>

        {/* Adjuntos */}
        {mensaje.files?.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1">
              <PaperClipIcon className="w-4 h-4" />
              Adjuntos:
            </div>
            <div className="flex flex-wrap gap-2">
              {mensaje.files.map((f, i) => {
                const tipo = f.mimeType || "";
                const extension =
                  tipo.includes("pdf")
                    ? "PDF"
                    : tipo.includes("word")
                    ? "DOCX"
                    : tipo.includes("image")
                    ? "IMG"
                    : "FILE";
                const color =
                  extension === "PDF"
                    ? "bg-red-700"
                    : extension === "DOCX"
                    ? "bg-blue-700"
                    : extension === "IMG"
                    ? "bg-green-700"
                    : "bg-gray-700";

                return (
                  <a
                    key={i}
                    href={f.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded-md text-xs font-medium ${color} hover:opacity-90 transition border border-gray-700 flex items-center gap-1`}
                  >
                    📎 {f.fileName}{" "}
                    <span className="opacity-70 text-[10px]">{extension}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Cuerpo del mensaje */}
        <div className="bg-gray-900 rounded-lg p-5 border border-gray-800 leading-relaxed text-[15px]">
          {mensaje.message
            ? formatearTexto(mensaje.message)
            : "Sin contenido disponible."}
        </div>
      </div>
    </div>
  );
};

export default VisualizarMensaje;
