import bruja from '../assets/logo.png';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';

const Reset = () => {
    const { fetchDataBackend } = useFetch();
    const { token } = useParams();
    const navigate = useNavigate();
    const [tokenback, setTokenBack] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const changePassword = (data) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`;
        fetchDataBackend(url, data, 'POST');

        setTimeout(() => {
            if (data.password === data.confirmpassword) {
                navigate('/login');
            }
        }, 3000);
    };

    useEffect(() => {
        const verifyToken = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`;
            fetchDataBackend(url, null, 'GET');
            setTokenBack(true);
        };
        verifyToken();
    }, [token]);

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
        <div className="flex flex-col items-center justify-center h-screen">
            <ToastContainer />
            <h1 
                className="text-3xl font-semibold mb-2 text-center text-dark-500" 
                style={{ fontFamily: 'Metal Mania, cursive' }}
            >
                Restablecer contraseña
            </h1>

            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={bruja}
                alt="image description"
            />

            {tokenback && (
                <form className="w-80" onSubmit={handleSubmit(changePassword)}>
                    <div className="mb-1">
                        <input
                            type="password"
                            placeholder="Ingresa tu nueva contraseña"
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            style={inputStyle}
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                        {errors.password && (
                            <p className="text-red-800" style={errorStyle}>
                                {errors.password.message}
                            </p>
                        )}

                        <input
                            type="password"
                            placeholder="Repite tu contraseña"
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            style={inputStyle}
                            {...register("confirmpassword", { required: "La confirmación es obligatoria" })}
                        />
                        {errors.confirmpassword && (
                            <p className="text-red-800" style={errorStyle}>
                                {errors.confirmpassword.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <button
                            className="bg-black text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white"
                            style={{ fontSize: '14px', marginTop: '15px', fontFamily: 'monospace' }}
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Reset;

const inputStyle = {
    marginTop: '10px',
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
    marginTop: '10px',
    marginBottom: '1px',
    marginLeft: '20px'
};
