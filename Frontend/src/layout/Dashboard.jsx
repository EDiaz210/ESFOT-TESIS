import { Link, Outlet, useLocation } from 'react-router'
import storeProfile from '../context/storeProfile'
import { useEffect } from "react";

const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname
    
    const{user} = storeProfile()

    function getHDImage(url) {
        if (!url) return url;
        if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
            return url.replace(/=s\d+/, "=s1024");
        }
        return url; 
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
        
        <div className='md:flex md:min-h-screen' style={inputSyle}>

            <div className='md:w-1/5 bg-[#111111] px-5 py-4'>
                <img
                src={
                    getHDImage(user?.avatarUsuario) ||
                    "src/assets/usuarioSinfoto.jpg"
                }
                alt={`Avatar de ${user?.nombre || "Estudiante"}`} 
               style={{ imageRendering: "high-quality" }}
                className="h-35 w-35 rounded-full object-cover mx-auto"/>
                <p className='text-white text-center my-4 text-sm'> <span className='bg-green-600 w-3 h-3 inline-block rounded-full'> </span>  ¡Bienvenido!{" "}
                    <span className="uppercase font-semibold text-[#20B2AA] ">
                        {user?.nombre}
                    </span></p>
                <p className='text-white text-center my-4 text-sm'> Rol:{" "}
                    <span className="uppercase font-semibold text-[#20B2AA] ">
                        {user?.rol}
                    </span></p>
                <hr className="mt-5 border-white" />

                <ul className="mt-5">
                    {user && user.rol === "estudiante" && (
                        <li className="text-center">
                        <Link
                            to="/dashboard"
                            className={`${urlActual === '/dashboard' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                        >
                            Perfil
                        </Link>
                        </li>
                    )}

                    {user && user.rol === "pasante" && (
                        <>
                        <li className="text-center">
                            <Link
                            to="/dashboard"
                            className={`${urlActual === '/dashboard' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Perfil
                            </Link>
                        </li>
                        
                        </>
                    )}

                    {user && user.rol === "administrador" && (
                        <>
                        <li className="text-center">
                            <Link
                            to="/dashboard"
                            className={`${urlActual === '/dashboard' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Perfil
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link
                            to="/dashboard/listar"
                            className={`${urlActual === '/dashboard/listar' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Lista
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link
                            to="/dashboard/create"
                            className={`${urlActual === '/dashboard/create' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Crear
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link
                            to="/dashboard/formularios"
                            className={`${urlActual === '/dashboard/formularios' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Formularios
                            </Link>
                        </li>


                        <li className="text-center">
                            <Link
                            to="/dashboard/ia"
                            className={`${urlActual === '/dashboard/ia' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Chat
                            </Link>
                        </li>
                        
                        <li className="text-center">
                            <Link
                            to="/dashboard/whatsapp"
                            className={`${urlActual === '/dashboard/whatsapp' ? 'text-[#20B2AA] bg-black px-3 py-2 text-center' : 'text-[#20B2AA]'} text-xl block mt-2 hover:bg-[#20B2AA] hover:text-black`}
                            >
                            Mensajes
                            </Link>
                        </li>
                        
                        </>
                    )}
                </ul>


            </div>

            <div className='flex-1 flex flex-col justify-between h-screen bg-[#111111]'>
                <div className='overflow-y-scroll  dashboard-scroll'>
                    <Outlet />
                </div>
            </div>
        </div>
        
    )
}

const inputSyle = { 
    fontFamily: 'Gowun Batang, serif'
}

export default Dashboard