import { MdDeleteForever, MdInfo, MdMessage } from "react-icons/md";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

const Table = () => {
  const { fetchDataBackend } = useFetch();
  const [estudiantes, setEstudiantes] = useState([]);
  const [pasantes, setPasantes] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("auth-token"));
  const token = storedUser?.state?.token;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // 🔹 Listar todos los estudiantes
  const listarEstudiantes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes`;
    try {
      const data = await fetchDataBackend(url, null, "GET", getHeaders());
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al listar estudiantes:", e);
      setEstudiantes([]);
    }
  };

  // 🔹 Listar todos los pasantes
  const listarPasantes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/pasantes`;
    try {
      const data = await fetchDataBackend(url, null, "GET", getHeaders());
      setPasantes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al listar pasantes:", e);
      setPasantes([]);
    }
  };

  // 🔹 Banear estudiante
  const banEstudiante = async (id) => {
    const ok = confirm("¿Banear a este estudiante?");
    if (!ok) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/banear/${id}`;
    try {
      const resp = await fetch(url, { method: "DELETE", headers: getHeaders() });
      if (!resp.ok) {
        toast.error("No se pudo banear al estudiante");
        return;
      }
      toast.success("Estudiante baneado");
      setEstudiantes((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al banear estudiante");
    }
  };

  // 🔹 Banear pasante
  const banPasante = async (id) => {
    const ok = confirm("¿Banear a este pasante?");
    if (!ok) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/pasante/banear/${id}`;
    try {
      const resp = await fetch(url, { method: "DELETE", headers: getHeaders() });
      if (!resp.ok) {
        toast.error("No se pudo banear al pasante");
        return;
      }
      toast.success("Pasante baneado");
      setPasantes((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al banear pasante");
    }
  };

  // 🔹 Redirecciones
  const goMessage = () => navigate(`/dashboard/whatsapp`);

  const goInfo = (id, tipo) => {
    if (tipo === "estudiante") {
      navigate(`/dashboard/visualizar/estudiante/${id}`);
    } else if (tipo === "pasante") {
      navigate(`/dashboard/visualizar/pasante/${id}`);
    } else {
      toast.error("Tipo de usuario desconocido");
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      await listarEstudiantes();
      await listarPasantes();
    })();
  }, [token]);

  if (!token) return <p>Debes iniciar sesión para ver esta tabla.</p>;

  const headers = ["N°", "Nombre completo", "Usuario", "Correo", "Estado", "Acciones"];

  return (
    <>
      <ToastContainer />

      {/* Estudiantes */}
      <h1 className="text-white mt-10 font-semibold mb-5 text-4xl">
        Estudiantes
      </h1>
      <TablaUsuarios
        data={estudiantes}
        headers={headers}
        onInfo={goInfo}
        onMessage={goMessage}
        onBan={banEstudiante}
        tipo="estudiante"
      />

      {/* Pasantes */}
      <h1 className="text-white mt-10 font-semibold mb-5 text-4xl">
        Pasantes
      </h1>
      <TablaUsuarios
        data={pasantes}
        headers={headers}
        onInfo={goInfo}
        onMessage={goMessage}
        onBan={banPasante}
        tipo="pasante"
      />
    </>
  );
};

// 🔹 Tabla adaptable con scroll y límite de 5 visibles
const TablaUsuarios = ({ data, headers, onInfo, onMessage, onBan, tipo }) => {
  return (
    <div className="relative shadow-lg bg-white mt-3 mb-10 overflow-hidden max-h-[340px] overflow-y-auto">
      <table
        className="w-full table-auto text-sm"
        style={{ fontFamily: "Gowun Batang, serif" }}
      >
        <thead className="sticky top-0 bg-black text-[#20B2AA] uppercase text-xs z-10">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3 text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((u, i) => (
              <tr
                key={u._id}
                className="bg-[#1a1a1a] text-white hover:bg-[#20B2AA] hover:text-black text-center transition-all"
              >
                <td className="py-2">{i + 1}</td>
                <td className="py-2">{`${u.nombre} ${u.apellido}`}</td>
                <td className="py-2">{u.username || "—"}</td>
                <td className="py-2">{u.email || "—"}</td>

                <td className="py-2">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.status ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <p className="text-xs font-medium">
                      {u.status ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </td>

                <td className="py-2">
                  <div className="flex items-center justify-center gap-3">
                    <MdInfo
                      title="Ver información"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onInfo(u._id, tipo)}
                    />
                    <MdMessage
                      title="Enviar mensaje"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onMessage(u._id)}
                    />
                    <MdDeleteForever
                      title="Eliminar/Banear"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onBan(u._id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-gray-400"
              >
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
