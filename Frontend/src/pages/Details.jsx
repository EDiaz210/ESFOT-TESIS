import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import useFetch from "../hooks/useFetch";
import { ToastContainer } from "react-toastify";

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchDataBackend } = useFetch();

  // 🔹 Detectar tipo según URL
  const tipo = location.pathname.includes("/estudiante/")
    ? "estudiante"
    : location.pathname.includes("/pasante/")
    ? "pasante"
    : null;

  // 🔹 Función para obtener los datos
  const obtenerDetalle = async () => {
    if (!tipo) {
      console.error("Tipo de detalle desconocido");
      setLoading(false);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser?.state?.token}`,
      };

      const url = `${import.meta.env.VITE_BACKEND_URL}/${tipo}/detalle/${id}`;
      const data = await fetchDataBackend(url, null, "GET", headers);
      setUsuario(data);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    obtenerDetalle();

    return () => {
      document.head.removeChild(link);
    };
  }, [id]);

  const getHDImage = (url) => {
    if (!url) return url;
    if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
      return url.replace(/=s\\d+/, "=s1024");
    }
    return url;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400 text-lg font-semibold">
        Cargando datos del {tipo}...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6 text-center text-red-500 text-lg font-semibold">
        No se encontró información del {tipo}.
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-6">
        <h1
          className="font-extrabold text-4xl text-white mb-4"
          style={{ fontFamily: "Gowun Batang, serif", fontSize: 40 }}
        >
          Visualizar {tipo === "estudiante" ? "Estudiante" : "Pasante"}
        </h1>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <p className="mb-12 text-lg text-white" style={inputStyle}>
          Este módulo te permite visualizar todos los datos del{" "}
          {tipo === "estudiante" ? "estudiante" : "pasante"} seleccionado.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start gap-14 bg-black p-8 rounded-lg shadow-lg">
          <div className="flex-1">
            <ul className="list-disc pl-8">
              <li
                className="text-3xl font-extrabold text-white mb-8"
                style={{ fontFamily: "Gowun Batang, serif", fontSize: 25 }}
              >
                Datos del {tipo}
              </li>
              <ul className="pl-6 space-y-6 text-xl text-white" style={inputStyle}>
                <li>
                  <span className="font-semibold">Nombre: </span>
                  {usuario?.nombre || "No disponible"}
                </li>
                <li>
                  <span className="font-semibold">Apellido: </span>
                  {usuario?.apellido || "No disponible"}
                </li>
                <li>
                  <span className="font-semibold">Correo electrónico: </span>
                  {usuario?.email || "No disponible"}
                </li>
                <li>
                  <span className="font-semibold">Usuario: </span>
                  {usuario?.username || "No disponible"}
                </li>

                {usuario?.numero && (
                  <li>
                    <span className="font-semibold">Número: </span>
                    {usuario.numero}
                  </li>
                )}

                {usuario?.carrera && (
                  <li>
                    <span className="font-semibold">Carrera: </span>
                    {usuario.carrera}
                  </li>
                )}

                <li>
                  <span className="font-semibold">Estado: </span>
                  <span
                    className={`text-base font-semibold px-4 py-1 rounded-full ${
                      usuario.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usuario.status ? "Activo" : "Inactivo"}
                  </span>
                </li>
              </ul>
            </ul>
          </div>

          <div className="flex-shrink-0 self-center md:self-start">
            <img
              src={
                getHDImage(usuario?.avatarUsuario) ||
                "/src/assets/usuarioSinfoto.jpg"
              }
              alt={`Avatar de ${usuario?.nombre || "usuario"}`}
              className="h-70 w-70 rounded-full object-cover shadow-xl border-4 border-black"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const inputStyle = { fontFamily: "Gowun Batang, serif" };

export default Details;
