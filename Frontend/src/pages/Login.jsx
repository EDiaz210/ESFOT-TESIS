import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useFetch from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import storeAuth from '../context/storeAuth';


const Login = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [showPassword, setShowPassword] = useState(false);
    const {fetchDataBackend} =useFetch()
    const {setToken,setRol} = storeAuth()
    
    const loginUser = async(data) => {
        const url = data.password.includes("Esfot")
            ? `${import.meta.env.VITE_BACKEND_URL}/login/administrador`
            : data.password.includes("pasante")
            ? `${import.meta.env.VITE_BACKEND_URL}/login/pasante`
            : `${import.meta.env.VITE_BACKEND_URL}/login`;
        const response = await fetchDataBackend(url, data,'POST', null)
        setToken(response.token)
        setRol(response.rol)
        
        if(response){
            navigate('/dashboard')
        }
    }


    const loginWithGoogle = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }

    

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
        <div className="flex flex-col sm:flex-row h-screen bg-black">
    <ToastContainer/>

    {/* Imagen de fondo */}
    <div className="w-full sm:w-8/12 h-1/3 sm:h-screen bg-[url('/public/login.jpg')] 
    bg-no-repeat bg-cover bg-center sm:block hidden">
    </div>

    {/* Contenedor de formulario */}
    <div className="w-full sm:w-4/12 sm:h-screen bg-black flex justify-center items-center">
        <div className="w-full max-w-[500px] px-4">
            <div className="mt-6 w-full h-[200px] bg-[url('/public/logo.png')] bg-no-repeat bg-contain bg-center"></div>
            <h1 className="pt-5 text-3xl font-semibold mb-2 text-center  text-white pb-5" style={{ fontFamily: 'Gowun Batang, serif' }}>Iniciar sesión</h1>
        
                                                                                                                                           
                    <form onSubmit={handleSubmit(loginUser)}>

                        {/* Correo electrónico */}
                        <div className="mb-3">
                            <input type="email" placeholder="Correo" className="block w-full  text-white " 
                            {...register("email", { required: "El correo es obligatorio" })}
                            style={inputStyle}/>
                            {errors.email && <p className="text-red-800" style={errorStyle} >{errors.email.message}</p>}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3 relative">
                            <div className="relative">
                                <input type="password" 
                                placeholder="Contraseña"
                                className="block w-full  focus:ring-1 focus:ring-purple-700 py-1 px-2 text-white"
                                {...register("password", { required: "La contraseña es obligatorio" })} style={inputStyle} />
                                {errors.password && (<p className="text-red-800" style={errorStyle}>{errors.password.message}</p>)}
                                
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón de iniciar sesión */}
                        <div className="my-4 flex justify-center">
                            <button className="w-[60px] h-[70px] bg-black text-white duration-300 hover:bg-[#20B2AA] hover:text-black flex items-center justify-center group">
                                <img 
                                    className="w-12 h-12 transition duration-300 group-hover:filter group-hover:brightness-0 group-hover:saturate-100" 
                                    src="/public/flecha.png" 
                                    alt="Flecha icon"
                                />
                                </button>
                        </div>
                    </form>

                    {/* Separador con opción de "O" */}
                    <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-white" />
                        <p className="text-center text-sm text-white">O</p>
                        <hr className="border-white" />
                    </div>

                    <div className="flex justify-center mt-5">
                    {/* Botón Google */}
                    <button
                        onClick={loginWithGoogle}
                        className="bg-black text-white border-black py-2 w-1/2  flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#20B2AA] hover:text-black"
                    >
                        <img
                        className="w-5 mr-2"
                        src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                        alt="Google icon"
                        />
                        Sign in with Google
                    </button>
                    </div>


                    {/* Olvidaste tu contraseña */}
                    <div 
                        style={{ fontSize: '14px', marginTop: '15px' , fontFamily: 'Gowun Batang, serif'}}>
                        <Link to="/forgot/id" className=" text-sm text-dark-400 text-white hover:text-[#20B2AA]">¿Olvidaste tu contraseña?</Link>
                    </div>

                    {/* Enlaces para volver o registrarse */}
                    <div className="mt-3 text-sm flex justify-between items-center text-white hover:text-[#20B2AA]">
                        <Link to="/" style={{ fontSize: '14px', marginTop: '15px' , fontFamily: 'Gowun Batang, serif'}}>Regresar</Link>
                        <Link to="/register" style={{ fontSize: '14px', marginTop: '15px' , fontFamily: 'Gowun Batang, serif'}}className="py-2 px-5 bg-black text-white   hover:scale-110 duration-300 hover:bg-[#20B2AA] hover:text-black">Registrarse</Link>
                    </div>
                </div>
            </div>
        </div>
    );

}

const inputStyle = {
  padding: '12px',
  background: '#1a1a28',
  fontSize: '15px',
  fontFamily: 'Gowun Batang, serif'
};

const errorStyle = {
  color: 'red',
  fontSize: '0.7rem',
  marginTop: '7px',
  marginBottom: '1px',
  marginLeft: '20px'
};


export default Login;
