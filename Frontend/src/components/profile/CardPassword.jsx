import { useForm } from "react-hook-form"
import { ToastContainer} from 'react-toastify';
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";
import { useEffect } from "react"

const CardPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const {user, updatePasswordProfile} = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (data) => {
        const response = await updatePasswordProfile(data, user._id)
        if (response) {
            setTimeout(() => {
                clearToken()
            }, 2000) 
        }
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
        <>
        <ToastContainer />
            <div className='mt-8' style = {{fontFamily: 'Gowun Batang, serif'}}>
            </div>

            <form onSubmit={handleSubmit(updatePassword)}>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">Contraseña actual</label>
                    <input type="password" placeholder="Ingresa tu contraseña actual" className="block w-full  py-1 px-2 bg-gray-950 bg-[#434343] mb-5 text-white" 
                    {...register("presentpassword", { required: "La contraseña actual es obligatoria" })}/>
                    {errors.presentpassword && <p className="text-red-800">{errors.presentpassword.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">Nueva contraseña</label>
                    <input type="password" placeholder="Ingresa la nueva contraseña" className="block w-full  py-1 px-2 bg-gray-950 mb-5 text-white" 
                    {...register("newpassword", { required: "La nueva contraseña es obligatoria" })}/>
                    {errors.newpassword && <p className="text-red-800">{errors.newpassword.message}</p>}
                </div>

                <input
                    type="submit"
                    className='bg-black w-full p-2 text-[#20B2AA] uppercase font-bold 
                        hover:bg-[#20B2AA] hover:text-black  cursor-pointer transition-all'
                    value='Cambiar' />

            </form>
        </>
    )
}

export default CardPassword