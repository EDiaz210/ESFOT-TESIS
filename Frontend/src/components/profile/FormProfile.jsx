import storeProfile from "../../context/storeProfile"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const FormularioPerfil = () => {
    const { user,updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = async(data) => {
        updateProfile(data,user._id)
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                email: user?.email,
                username: user?.username
            })
        }
    }, [user])


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
        <form onSubmit={handleSubmit(updateUser)} style={inputSyle}>
            <div>
                <label className="mb-2 block text-sm font-semibold text-white">Nombre</label>
                <input type="text"  placeholder={user?.nombre || ""} className="block w-full   py-1 px-2  bg-gray-950 mb-5 text-white" 
                {...register("nombre", { required: "El nombre es obligatorio" })}/>
                {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-white">Apellido</label>
                <input type="text" placeholder={user?.apellido || ""} className="block w-full   py-1 px-2  bg-gray-950 mb-5 text-white" 
                {...register("apellido", { required: "El apellido es obligatorio" })}/>
                {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-white">Nombre de usuario</label>
                <input type="text" placeholder={user?.username || ""} className="block w-full  py-1 px-2  bg-gray-950 mb-5 text-white" 
                {...register("username", { required: "El usuario es obligatorio" })}/>
                {errors.username && <p className="text-red-800">{errors.username.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-white">Email</label>
                <input type="email" placeholder={user?.email || ""} className="block w-full   py-1 px-2 bg-gray-950 mb-5 text-white"
                {...register("email", { required: "El usuario es obligatorio" })}/>
                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
            </div>


            <input
                type="submit"
                className='bg-black w-full p-2 mt-5 text-[#20B2AA] uppercase font-bold  
                        hover:bg-[#20B2AA] hover:text-black cursor-pointer transition-all'
                value='Actualizar' />

        </form>
    )
    
}

const inputSyle = { 
    fontFamily: 'Gowun Batang, serif'
}



export default FormularioPerfil