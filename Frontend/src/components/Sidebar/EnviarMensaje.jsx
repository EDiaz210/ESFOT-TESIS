import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

import QRCode from "react-qr-code";
import pdfIcon from "../../assets/pdf-icon.png";
import wordIcon from "../../assets/word-icon.png";
import excelIcon from "../../assets/excel-icon.jpg";
import fileIcon from "../../assets/file-icon.png";


const storedUser = JSON.parse(localStorage.getItem("auth-token"));
const token = storedUser?.state?.token;


function splitNumbers(text) {
  return text
    .split(/[\s,;\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function htmlToText(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function getFilePreview(file) {
  const type = file.type;
  if (type.startsWith("image/")) return URL.createObjectURL(file);
  if (type === "application/pdf") return pdfIcon;
  if (type.includes("word")) return wordIcon;
  if (type.includes("excel")) return excelIcon;
  return fileIcon;
}


const ALLOWED_TIPOS = ["Administrativas", "Académicas", "Extracurriculares"];


const EnviarMensaje = () => {
  const [message, setMessage] = useState("");
  const [tipo, setTipo] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qr, setQr] = useState();
  const [resultadosCarrera, setResultadosCarrera] = useState({});


  // Handlers
  const addNumbersFromString = (str) => {
    const toAdd = splitNumbers(str);
    setNumbers((prev) => Array.from(new Set([...prev, ...toAdd])));
  };

  const removeNumber = (num) =>
    setNumbers((prev) => prev.filter((n) => n !== num));

  const handleInputKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addNumbersFromString(inputValue);
        setInputValue("");
        setInputHeight(40);
      }
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (text) {
      e.preventDefault();
      addNumbersFromString(text);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    const h = Math.min(140, Math.max(40, inputRef.current.scrollHeight));
    setInputHeight(h);
  }, [inputValue]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; 
  };

  const handleRemoveFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const obtenerQr = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/qr`,
        { validateStatus: (s) => s < 500, headers: { "Cache-Control": "no-cache" } }
      );
      if (data?.ready) {
        setLoggedIn(true);
        return null;
      }
      if (data?.qr) return data.qr;
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error al obtener QR");
      return null;
    }
  };

  const verificarStatus = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/status`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      const ready = Boolean(data?.ready);
      setLoggedIn(ready);
      return ready;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error al verificar estado");
      return false;
    }
  };

  const enviarMensajes = async (mensaje, numeros, files, tipo) => {
  if (!mensaje && (!files || files.length === 0)) {
    toast.error("Debes enviar un mensaje o un archivo.");
    return [];
  }
  if (!Array.isArray(numeros) || numeros.length === 0) {
    toast.error("Debes ingresar al menos un número válido.");
    return [];
  }
  if (!tipo || tipo.trim() === "") {
    toast.error("Debes seleccionar un tipo válido.");
    return [];
  }

  const tipoClean = tipo.trim();
  if (!ALLOWED_TIPOS.includes(tipoClean)) {
    toast.error(
      "El campo 'tipo' debe ser Administrativas, Académicas o Extracurriculares."
    );
    return [];
  }

  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/send-message`;
    const form = new FormData();
    form.append("message", htmlToText(mensaje) || "");
    form.append("tipo", tipoClean);

    numeros.forEach((n) => form.append("numbers", n));

    const filesArray = Array.isArray(files) ? files : [files];
    filesArray.forEach((file) => form.append("files", file));

    const { data } = await axios.post(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("📨 Mensajes enviados correctamente");
    return data?.results || [];
  } catch (error) {
    console.error("Error al enviar mensajes:", error);
    toast.error(error?.response?.data?.error || "Error al enviar mensajes");
    return [];
  }
};


  const handleNumbersSend = async () => {
    if (!numbers.length) {
      toast.error("Agrega al menos un número");
      return;
    }
    setSending(true);
    setResults([]);
    const res = await enviarMensajes(message, numbers,  files, tipo);
    setResults(
      res.map((r) => ({
        success: r.status === "sent",
        number: r.to?.replace("@c.us", "") || "",
        error: r.error || null,
      }))
    );
    setSending(false);
  };

  // Polling QR
  useEffect(() => {
    if (!showQrModal) return;
    setQr(null);
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      const ready = await verificarStatus();
      if (ready) {
        setShowQrModal(false);
        setQr(null);
        return;
      }
      const q = await obtenerQr();
      if (q) setQr(q);
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [showQrModal]);

   useEffect(() => {
              const link = document.createElement("link");
              link.href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
              link.rel = "stylesheet";
              document.head.appendChild(link);
              return () => {
              document.head.removeChild(link);
          };
      }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen w-full font-sans bg-[#111111] overflow-hidden" style={inputStyle}>

        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
            {/* Números */}
            <div className="w-full max-w-[1100px] bg-gray-900 text-white border-gray-800 p-5 shadow-sm">
              <h3 className="font-medium text-[#20B2AA] text-lg mb-3">
                Números de contacto
              </h3>
              <div className="flex flex-wrap gap-3 p-3 border px-3 py-2 border-gray-700 bg-[#1a1a1a] min-h-[56px] max-h-48 overflow-auto">
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  >
                    <span className="mr-2 ">{num}</span>
                    <button
                      className="text-gray-400 hover:text-gray-200 transition"
                      onClick={() => removeNumber(num)}
                    >
                      <XMarkIcon className="w-4 h-4 " />
                    </button>
                  </div>
                ))}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onPaste={handlePaste}
                  placeholder="Pegue o escriba los números, separa con comas o Enter"
                  className="flex-1 min-w-[180px] text-sm placeholder-gray-400 rounded-md bg-gray-800 border border-gray-700 text-white px-2 py-3 focus:outline-none focus:ring-2 overflow-auto min-h-[45.3px] max-h-[200px] resize-none"
                  style={{ height: inputHeight }}
                />
                {/* Combobox de tipo */}
                <div className="flex flex-col text-gray-300">
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white px-3 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Administrativas">Administrativas</option>
                    <option value="Académicas">Académicas</option>
                    <option value="Extracurriculares">Extracurriculares</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Editor de mensaje */}
            <div className="w-full max-w-[1100px] bg-gray-900 text-white rounded-lg border border-gray-800 p-5 shadow-sm">
              <h3 className="font-medium text-[#20B2AA] text-lg mb-3 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#20B2AA]" />
                Redactar mensaje
              </h3>
              <Editor
                apiKey="w7q3mgtdwp4f5ula0nkgydefa1gjemobhbkqksmyeh0dddub"
                value={message}
                onEditorChange={(content) => setMessage(content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ["link", "lists", "paste"],
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link",
                  branding: false,
                  skin: "oxide-dark",
                  content_css: "dark",
                  content_style: `body { background-color: #1a1a1a; color: #ffffff; font-family: 'Gowun Batang', serif; } ::placeholder { color: #888888; }`,
                }}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-between w-full max-w-[1100px] gap-4">
              <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 px-4 py-2 rounded-md cursor-pointer font-medium hover:bg-gray-700 transition">
                <PhotoIcon className="w-5 h-5 text-white" />
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  value=""
                />

              </label>

              {!loggedIn && (
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition"
                >
                  Obtener QR
                </button>
              )}

              <button
                onClick={handleNumbersSend}
                disabled={sending}
                className="flex items-center gap-2 bg-[#20B2AA] hover:bg-teal-500 text-black px-4 py-2 rounded-md font-medium transition disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </div>

            {/* Preview archivos */}
            {files.length > 0 && (
              <div className="w-full max-w-[1100px] bg-gray-900 text-white rounded-lg border border-gray-800 p-4 flex flex-wrap gap-4 shadow-sm">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getFilePreview(file)}
                      alt={`preview ${index}`}
                      className="w-28 h-28 object-cover rounded-md border border-gray-700"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-gray-800 text-gray-200 rounded-full p-1 border border-gray-700 opacity-0 group-hover:opacity-100 transition"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Modal QR */}
            {showQrModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4 text-[#20B2AA]">
                    Escanea este QR
                  </h3>

                  {qr ? (
                    qr.startsWith("data:image") ? (
                      <img
                        src={qr}
                        alt="QR de WhatsApp"
                        className="w-[256px] h-[256px] object-contain"
                      />
                    ) : (
                      <QRCode value={qr} size={256} />
                    )
                  ) : (
                    <p className="text-gray-400">Esperando QR...</p>
                  )}

                  <button
                    onClick={() => setShowQrModal(false)}
                    className="mt-4 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition border border-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {/* 🔹 Selección horizontal de carreras */}
            <div className="w-full max-w-[1100px] bg-gray-900 text-white rounded-lg border border-gray-800 p-5 shadow-sm mt-3">
              <h3 className="font-medium text-[#20B2AA] text-lg mb-3 text-center">
                Selección de carreras
              </h3>

              <div className="grid grid-cols-7 gap-3 text-center">
                {["Todos", "TSDS", "TSEM", "TSASA", "TSPIM", "TSPA", "TSRT"].map((carrera) => (
                  <div key={carrera} className="flex flex-col items-center">
                    <label className="flex flex-col items-center gap-1 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#20B2AA]"
                        checked={!!resultadosCarrera[carrera]}
                        onChange={async (e) => {
                          const checked = e.target.checked;

                          if (carrera === "Todos") {
                            const carrerasInd = ["TSDS", "TSEM", "TSASA", "TSPIM", "TSPA", "TSRT"];
                            if (checked) {
                              for (const c of carrerasInd) {
                                try {
                                  const { data } = await axios.get(
                                    `${import.meta.env.VITE_BACKEND_URL}/estudiantes?carrera=${c}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  const numeros = data.map((x) => x.numero).filter(Boolean);
                                  setNumbers((prev) => Array.from(new Set([...prev, ...numeros])));
                                  setResultadosCarrera((prev) => ({ ...prev, [c]: data }));
                                } catch {
                                  toast.error(`Error al cargar ${c}`);
                                }
                              }
                              toast.success("Se agregaron todas las carreras");
                            } else {
                              setResultadosCarrera({});
                              setNumbers([]);
                              toast.info("Se deseleccionaron todas las carreras");
                            }
                            return;
                          }

                          try {
                            const { data } = await axios.get(
                              `${import.meta.env.VITE_BACKEND_URL}/estudiantes?carrera=${carrera}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            const numeros = data.map((x) => x.numero).filter(Boolean);

                            if (checked) {
                              setNumbers((prev) => Array.from(new Set([...prev, ...numeros])));
                              setResultadosCarrera((prev) => ({ ...prev, [carrera]: data }));
                              toast.info(`Se agregaron ${numeros.length} números de ${carrera}`);
                            } else {
                              setNumbers((prev) => prev.filter((n) => !numeros.includes(n)));
                              setResultadosCarrera((prev) => {
                                const nuevo = { ...prev };
                                delete nuevo[carrera];
                                return nuevo;
                              });
                              toast.info(`Se quitó ${carrera}`);
                            }
                          } catch (error) {
                            console.error("Error al obtener estudiantes:", error);
                            toast.error("Error al obtener los estudiantes");
                          }
                        }}
                      />
                      <span className="text-sm font-semibold">{carrera}</span>
                    </label>

                    <div
                      className="w-full h-[200px] overflow-y-auto bg-[#1a1a1a] border border-gray-700 rounded-md px-2 py-1 text-xs text-left custom-scroll"
                      style={{ scrollbarGutter: "stable" }}
                    >
                      {Array.isArray(resultadosCarrera[carrera]) && resultadosCarrera[carrera].length > 0 ? (
                        resultadosCarrera[carrera].map((est, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-800 pb-1 mb-1 truncate"
                            title={`${est.nombre} ${est.apellido} — ${est.numero || ""}`}
                          >
                            <div className="truncate font-medium">{est.nombre} {est.apellido}</div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {est.numero || "—"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic text-center mt-8">—</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const inputStyle = { fontFamily: "Gowun Batang, serif" };

export default EnviarMensaje;