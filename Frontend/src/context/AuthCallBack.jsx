import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import storeProfile from "../context/storeProfile";
import storeAuth from "../context/storeAuth";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = storeProfile((state) => state.setUser);
  const setToken = storeAuth((state) => state.setToken);

  const rol = "estudiante"
  // Función para validar token (opcional)
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.error("No token recibido");
      return;
    }

    // Limpiar sesión previa
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth-token");


    const decoded = parseJwt(token);
    if (!decoded) {
      console.error("Token inválido");
      return;
    }

    if (decoded.exp * 1000 < Date.now()) {
      console.error("Token expirado");
      return;
    }

  
    setToken(token);
    localStorage.setItem("auth-token", JSON.stringify({ state: { token, rol } }));


    fetch("http://localhost:3000/api/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || "Error al obtener perfil");
        }
        return res.json();
      })
      .then((data) => {
        // data debe contener _id, nombre, email, rol, username, etc.
        setUser(data);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.error("Error obteniendo perfil tras login Google:", error.message);
        // Opcional: limpiar token y usuario si falla
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth-token");
        // Opcional: redirigir al login o mostrar mensaje
        navigate("/login", { replace: true });
      });
  }, [location.search, navigate, setToken, setUser]);

}

