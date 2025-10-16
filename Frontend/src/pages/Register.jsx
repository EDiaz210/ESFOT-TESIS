import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    return () => {
      document.head.removeChild(link);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 const onSubmit = async (data) => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v && v.trim() !== "")
    );
    const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
    const res = await axios.post(url, cleanData, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.msg || "Registro exitoso ");
  } catch (error) {
    console.error("Error en el registro:", error.response?.data || error.message);

    if (error.response?.data?.msg) {
      toast.error(error.response.data.msg);
    } else {
      toast.error("Error en el registro");
    }
  }
};



  return (
    <div className="flex w-screen h-screen fixed top-0 left-0 overflow-hidden font-['Gowun_Batang',serif] bg-black">
      {/* Panel de imagen */}
      {windowWidth >= 1000 && (
        <div className="relative w-2/3 h-full bg-gradient-to-br from-[#1a1a28] via-[#0b0b10] to-[#1a1a28] overflow-hidden">
          <img
            src="/public/register2.jpg"
            alt="Fondo de registro"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000cc] to-[#00000066]" />
          <div className="absolute bottom-16 left-16 z-10">
            <h1 className="text-5xl text-[#20B2AA] font-bold drop-shadow-lg mb-2">
              ¡Bienvenido!
            </h1>
            <p className="text-gray-200 text-lg max-w-md">
              Regístrate y forma parte de nuestra comunidad de estudiantes.
            </p>
          </div>
        </div>
      )}

      {/* Panel de formulario */}
      <div
        className={`flex flex-col items-center justify-center bg-black text-white h-full ${
          windowWidth < 1000 ? "w-full" : "w-1/3"
        } px-5 sm:px-16 md:px-20`}
      >
        <img
          src="/logo.png"
          alt="logo"
          className="w-[160px] mb-1 drop-shadow-lg"
        />

        <h2 className="pt-7 text-4xl pb-5 font-bold text-[#20B2AA]">
          Registro
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xs flex flex-col gap-1"
        >
          <input
            type="text"
            placeholder="Nombre"
            {...register("nombre", { required: true })}
            className="p-3 block w-full bg-[#1a1a28] text-white "
            style={inputStyle}
          />
          {errors.nombre && <p className="text-red-800" style={errorStyle}>Nombre requerido</p>}

          <input
            type="text"
            placeholder="Apellido"
            {...register("apellido", { required: true })}
            className="p-3 mt-1 block w-full bg-[#1a1a28] text-white "
            style={inputStyle}
          />
          {errors.apellido && <p className="text-red-800" style={errorStyle}>Apellido requerido</p>}

          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
            className="p-3 mt-1 block w-full bg-[#1a1a28] text-white "
            style={inputStyle}
          />
          {errors.username && <p className="text-red-800" style={errorStyle}>Usuario requerido</p>}

          <input
            type="text"
            placeholder="Numero"
            {...register("numero", { required: true })}
            className="p-3 mt-1 block w-full bg-[#1a1a28] text-white "
            style={inputStyle}
          />
          {errors.numero && <p className="text-red-800" style={errorStyle}>Número requerido</p>}

          <select
            {...register("carrera", { required: "Selecciona una carrera" })}
            defaultValue=""
            className="p-3 mt-1 block w-full bg-[#1a1a28] text-white"
            style={inputStyle}
          >
            <option value="" disabled>Selecciona una Carrera</option>
            <option value="TSDS">Desarrollo de Software</option>
            <option value="TSEM">Electromecánica</option>
            <option value="TSASA">Agua y Saneamiento Ambiental</option>
            <option value="TSPIM">Procesamiento Industrial de la Madera</option>
            <option value="TSPA">Procesamiento de Alimentos</option>
            <option value="TSRT">Redes y Telecomunicaciones</option>
          </select>
          {errors.carrera && <p className="text-red-800" style={errorStyle}>{errors.carrera.message}</p>}


          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="p-3 mt-1 block w-full bg-[#1a1a28] text-white "
            style={inputStyle}
          />
          {errors.email && <p className="text-red-800" style={errorStyle}>Email requerido</p>}

          {/* Contraseña con toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password", { required: true })}
              className="p-3 mt-1 block w-full bg-[#1a1a28] text-white "
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-800" style={errorStyle}>
              Contraseña requerida
            </p>
          )}

          <button
            type="submit"
            className="mt-5 py-3 bg-[#20B2AA] text-black text-lg font-bold uppercase cursor-pointer hover:bg-[#18a192]  duration-300"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-[#20B2AA] hover:underline">
            Inicia sesión
          </Link>
        </p>

        <ToastContainer />
      </div>
    </div>
  );
};


const inputStyle = {
  fontSize: "15px",
  fontFamily: "Gowun Batang, serif",
};

const errorStyle = {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "2px",
};
