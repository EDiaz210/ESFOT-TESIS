import bruja from '../assets/logo.png'
import {Link, useParams} from 'react-router'
import { useEffect } from 'react'
import axios from 'axios';
import { ToastContainer ,toast} from 'react-toastify';


export const Confirm = () => {
    const {token, rol} = useParams()
    const verificartoken = async ()=>{
        try {
            const url = rol
            ? `${import.meta.env.VITE_BACKEND_URL}/confirmar/pasante/${token}`
            : `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`;
            const respuesta = await axios.get(url)
            toast.success(respuesta?.data?.msg)
        } catch (error) {
            toast.error(error?.response?.data?.msg)
        }
    }
    useEffect(() => {
        verificartoken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        
        <div className="flex flex-col items-center justify-center h-screen">

            <ToastContainer/>

            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src={bruja} alt="image description"/>

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12"
                style={{ fontFamily: 'monospace'}}>Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8"
                style={{fontFamily: 'monospace'}} >Ya puedes iniciar sesión</p>
                <Link to="/login" className="p-3 m-5 w-full text-center bg-black text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"style={{fontFamily: 'monospace'}}>Login</Link>
            </div>

        </div>
    )
}

export default Confirm