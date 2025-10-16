import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const getAuthHeaders = () => {
  const storedUser = JSON.parse(localStorage.getItem("auth-token"));
  const token = storedUser?.state?.token;
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const storeProfile = create((set) => ({
  user: null,

  
  setUser: (userData) => set({ user: userData }),

  clearUser: () => set({ user: null, rol: null, token: null}),

  profile: async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      if (!storedUser) throw new Error("No hay token guardado");
      const endpoint =
        storedUser.state.rol === "administrador"
          ? "perfil/administrador"
          : storedUser.state.rol === "pasante"
          ? "perfil/pasante"
          : "perfil";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;

      const respuesta = await axios.get(url, getAuthHeaders());
      set({ user: respuesta.data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateProfile: async (data, id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      if (!storedUser) throw new Error("No hay token guardado");
      const endpoint =
        storedUser.state.rol === "administrador"
          ? "administrador"
          : storedUser.state.rol === "pasante"
          ? "pasante"
          : "estudiante";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      set({ user: respuesta.data });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  updatePasswordProfile: async (data, id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      if (!storedUser) throw new Error("No hay token guardado");
      const endpoint =
        storedUser.state.rol === "administrador"
          ? "administrador"
          : storedUser.state.rol === "pasante"
          ? "pasante"
          : "estudiante";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/actualizarpassword/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      toast.success("Contraseña actualizada correctamente");
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  deleteAccount: async (id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      const endpoint =
        storedUser.state.rol === "administrador"
          ? "administrador"
          : storedUser.state.rol === "pasante"
          ? "pasante"
          : "estudiante";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/eliminar/${id}`;
      const respuesta = await axios.delete(url, getAuthHeaders());
      toast.success("Tu cuenta ha sido eliminada correctamente");
      
      set({ user: null });
      localStorage.removeItem("auth-token");

        
      setTimeout(() => {
        window.location.href = "/login"; 
        window.location.reload();        
      }, 800);
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  uploadAvatar: async (file, id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      const token = storedUser.state.token
      if (!storedUser) throw new Error("No hay token guardado");
      const endpoint =
        storedUser.state.rol === "administrador"
          ? "administrador"
          : storedUser.state.rol === "pasante"
          ? "pasante"
          : "estudiante";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/imagen/${id}`;
      const formData = new FormData();
      formData.append("imagen", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const respuesta = await axios.put(url, formData, config);

      set({ user: respuesta.data });
      toast.success("Imagen actualizada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Error al subir la imagen");
      throw error;
    }
  },
}));

export default storeProfile;
