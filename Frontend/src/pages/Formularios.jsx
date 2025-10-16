import { useState, useEffect } from "react";
import { FileText, CheckCircle, XCircle, Eye } from "lucide-react";

const cardStyle = {
  width: "160px",
  height: "100px",
  background: "#171717",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0px 0px 5px 2px #00000088",
  cursor: "pointer",
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: "10px",
};

const contentStyle = {
  width: "156px",
  height: "96px",
  background: "#171717",
  borderRadius: "10px",
  zIndex: 1,
  padding: "10px",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
};

const Formularios = () => {
  const [formularios, setFormularios] = useState([
    { id: 1, estudiante: "Carlos Pérez", tipo: "Prácticas", estado: "Pendiente", pdf: null },
    { id: 2, estudiante: "Ana Torres", tipo: "Vinculación", estado: "Aprobado", pdf: null },
    { id: 3, estudiante: "Luis Gómez", tipo: "Prácticas", estado: "Rechazado", pdf: null },
  ]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoFormulario, setNuevoFormulario] = useState({ estudiante: "", tipo: "", pdf: null });
  const [orden, setOrden] = useState({ columna: "id", asc: true });

  useEffect(() => {
    return () => {
      formularios.forEach((f) => {
        if (f.pdf) URL.revokeObjectURL(f.pdf.preview);
      });
    };
  }, [formularios]);

  const actualizarEstado = (id, nuevoEstado) => {
    setFormularios((prev) =>
      prev.map((f) => (f.id === id ? { ...f, estado: nuevoEstado } : f))
    );
  };

  const manejarSubidaPDF = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Solo se aceptan archivos PDF.");
      return;
    }
    if (file) {
      file.preview = URL.createObjectURL(file);
      setNuevoFormulario({ ...nuevoFormulario, pdf: file });
    }
  };

  const manejarAgregarFormulario = () => {
    if (!nuevoFormulario.estudiante || !nuevoFormulario.tipo || !nuevoFormulario.pdf) {
      alert("Complete todos los campos y suba un PDF");
      return;
    }
    const nuevo = { id: formularios.length + 1, ...nuevoFormulario, estado: "Pendiente" };
    setFormularios([...formularios, nuevo]);
    setNuevoFormulario({ estudiante: "", tipo: "", pdf: null });
    setMostrarModal(false);
  };

  const filtrarFormularios = () => {
    let res = formularios;
    if (filtro !== "Todos") res = res.filter((f) => f.estado === filtro);
    if (busqueda) {
      const busqLower = busqueda.toLowerCase();
      res = res.filter(
        (f) =>
          f.estudiante.toLowerCase().includes(busqLower) ||
          f.tipo.toLowerCase().includes(busqLower)
      );
    }
    res = [...res].sort((a, b) => {
      let aVal = a[orden.columna];
      let bVal = b[orden.columna];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });
    return res;
  };

  const cambiarOrden = (columna) => {
    if (columna === orden.columna) setOrden({ columna, asc: !orden.asc });
    else setOrden({ columna, asc: true });
  };

  const estadoColors = {
    Aprobado: "bg-green-900 text-green-400",
    Pendiente: "bg-yellow-900 text-yellow-400",
    Rechazado: "bg-red-900 text-red-400",
    "En revisión": "bg-blue-900 text-blue-400",
  };

  const formulariosFiltrados = filtrarFormularios();

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-black border-b border-gray-800 flex items-center px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#20B2AA]" />
            <h2 className="text-lg font-semibold text-[#20B2AA]">Gestión de Formularios</h2>
          </div>
        </header>

        {/* Buscador + Nuevo Formulario */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por estudiante o tipo..."
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white w-80 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={() => setMostrarModal(true)}
            className="px-5 py-2 bg-gradient-to-r from-[#20B2AA] to-[#3bd9d0] text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            + Nuevo Formulario
          </button>
        </div>

        {/* Filtros tipo card */}
        <div className="flex gap-6 mb-6 flex-wrap justify-center p-2">
          {["Aprobado", "Rechazado", "En revisión"].map((estado) => (
            <div
              key={estado}
              style={cardStyle}
              onClick={() => setFiltro(estado)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={contentStyle}>
                <span className="font-semibold text-white">{estado}</span>
              </div>
            </div>
          ))}
          <div
            style={cardStyle}
            onClick={() => setFiltro("Todos")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={contentStyle}>
              <span className="font-semibold text-white">Todos</span>
            </div>
          </div>
        </div>

        {/* Tabla de formularios */}
        <main className="flex-1 overflow-auto p-6 flex flex-col gap-6 items-center">
          <div className="overflow-x-auto w-full max-w-[1400px]">
            <table className="w-full border rounded-lg overflow-hidden bg-gray-900 text-white shadow-sm">
              <thead className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 border-r cursor-pointer" onClick={() => cambiarOrden("estudiante")}>Estudiante</th>
                  <th className="px-4 py-3 border-r cursor-pointer" onClick={() => cambiarOrden("tipo")}>Tipo</th>
                  <th className="px-4 py-3 border-r cursor-pointer" onClick={() => cambiarOrden("estado")}>Estado</th>
                  <th className="px-4 py-3 border-r">PDF</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {formulariosFiltrados.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-800 transition">
                    <td className="px-4 py-2">{f.estudiante}</td>
                    <td className="px-4 py-2">{f.tipo}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full font-semibold ${estadoColors[f.estado]}`}>
                        {f.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {f.pdf ? (
                        <a href={f.pdf.preview} target="_blank" rel="noopener noreferrer" className="text-[#20B2AA] underline">
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No adjunto</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <CheckCircle
                        className="cursor-pointer hover:text-green-400"
                        title="Marcar como Aprobado"
                        onClick={() => actualizarEstado(f.id, "Aprobado")}
                      />
                      <XCircle
                        className="cursor-pointer hover:text-red-400"
                        title="Marcar como Rechazado"
                        onClick={() => actualizarEstado(f.id, "Rechazado")}
                      />
                      <Eye
                        className="cursor-pointer hover:text-blue-400"
                        title="Marcar en Revisión"
                        onClick={() => actualizarEstado(f.id, "En revisión")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal para nuevo formulario */}
          {mostrarModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-800">
                <h3 className="text-lg font-bold text-[#20B2AA] mb-4">Nuevo Formulario</h3>
                <input
                  type="text"
                  placeholder="Nombre del estudiante"
                  className="w-full mb-3 p-2 border rounded-lg bg-gray-800 border-gray-700 text-white"
                  value={nuevoFormulario.estudiante}
                  onChange={(e) => setNuevoFormulario({ ...nuevoFormulario, estudiante: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tipo de formulario"
                  className="w-full mb-3 p-2 border rounded-lg bg-gray-800 border-gray-700 text-white"
                  value={nuevoFormulario.tipo}
                  onChange={(e) => setNuevoFormulario({ ...nuevoFormulario, tipo: e.target.value })}
                />
                <input type="file" accept="application/pdf" className="w-full mb-4" onChange={manejarSubidaPDF} />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={manejarAgregarFormulario}
                    className="px-4 py-2 bg-gradient-to-r from-[#20B2AA] to-[#3bd9d0] rounded-lg hover:scale-105 transition-transform text-black"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Formularios;
