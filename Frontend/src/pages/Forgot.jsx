import { Link, useLocation } from 'react-router';
import useFetch from '../hooks/useFetch';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

export const Forgot = () => {
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { fetchDataBackend } = useFetch();

    const sendMail = (data) => {
        const isAdminRoute = location.pathname.includes("recuperarpasswordAdmin");
        const url = isAdminRoute
            ? `${import.meta.env.VITE_BACKEND_URL}/recuperarpasswordAdmin`
            : `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`;

        fetchDataBackend(url, data, 'POST');
    };

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Bungee&family=Lato:wght@400;900&family=Roboto:wght@400;700;900&family=Metal+Mania&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            <ToastContainer />   
            <div className="w-full sm:w-4/12 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full">
                    <div className="w-full h-[200px] bg-[url('/images/logo.png')] bg-no-repeat bg-contain bg-center"></div>

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-dark-500" style={{ fontFamily: 'Metal Mania, cursive' }}>
                        {location.pathname.includes("recuperarpasswordAdmin") 
                            ? "Recuperar contraseña (Administrador)" 
                            : "¡Olvidaste tu contraseña!"}
                    </h1>

                    <form onSubmit={handleSubmit(sendMail)}>
                        <div className="mb-1">
                            <input 
                                type="email" 
                                placeholder="Ingresa un correo electrónico válido" 
                                className="block w-full rounded-md border border-white-300 focus:border-dark-700 focus:outline-none focus:ring-1 focus:ring-dark-700 py-1 px-1.5 text-gray-500" 
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                                style={inputStyle}
                            />
                            {errors.email && <p className="text-red-800" style={errorStyle}>{errors.email.message}</p>}
                        </div>

                        <div className="mb-3">
                            <button 
                                style={{ fontSize: '14px', marginTop: '15px', fontFamily: 'monospace' }} 
                                className="bg-black text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-800 hover:text-white">
                                Enviar correo
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4"></div>

                    <div className="mt-3 text-sm flex justify-between items-center" style={{ fontSize: '14px', marginTop: '15px', fontFamily: 'monospace' }}>
                        <p>¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-black text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-800 hover:text-white">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-8/12 h-1/3 sm:h-screen bg-[url('/public/images/wraith3.png')] 
                bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#eeeeee',
    fontSize: '15px',
    fontFamily: 'monospace'
};

const errorStyle = {
    color: 'red',
    fontSize: '0.7rem',
    marginTop: '1px',
    marginBottom: '1px',
    marginLeft: '20px'
};
