import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { convertBlobToBase64 } from "../../helpers/consultarIA"
import { toast, ToastContainer } from "react-toastify"


export const Form = ({ patient }) => {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm()
    const { fetchDataBackend } = useFetch()


    const selectedOption = watch("imageOption")


    const registerPatient = async (data) => {
    
        const formData = new FormData()
      
        Object.keys(data).forEach((key) => {
            if (key === "imagen") {
                formData.append("imagen", data.imagen[0]) 
            } else {
                formData.append(key, data[key]) 
            }
        })
        let url = `${import.meta.env.VITE_BACKEND_URL}/registro/pasante`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storedUser.state.token}`
        }

        let response
        if (patient?._id) {
            url = `${import.meta.env.VITE_BACKEND_URL}/administrador/actualizar/${patient._id}`
            response = await fetchDataBackend(url, formData, "PUT", headers)
        }
        else {
            response = await fetchDataBackend(url, formData, "POST", headers)
        }
        
    }

    useEffect(() => {
        if (patient) {
            reset({
                nombre: patient?.nombre,
                apellido: patient?.apellido,
                email: patient?.email,
                username: patient?.username,
            })
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(registerPatient)}>
            <ToastContainer />

            {/* Información del propietario */}
            <fieldset className="border-2 border-gray-950 p-6  shadow-lg text-white">
                <legend className="text-xl font-bold text-[#20B2AA] bg-black px-4 py-1 ">
                    Información del Pasante
                </legend>

                {/* Nombre */}
                <div>
                    <label className="mb-2 block  text-sm  font-semibold">Nombre</label>
                    <div className="flex items-center gap-10 mb-5">
                        <input
                            type="text"
                            placeholder="Ingresa el nombre"
                            className="block w-full  bg-gray-950 py-1 px-2 text-white"
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                        />
                    </div>
                    {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
                </div>

                {/* Nombre completo */}
                <div>
                    <label className="mb-2 block text-sm font-semibold ">Apellido</label>
                    <input
                        type="text"
                        placeholder="Ingresa el apellido"
                        className="block w-full  bg-gray-950 py-1 px-2 text-white mb-5"
                        {...register("apellido", { required: "El apellido es obligatorio" })}
                    />
                    {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
                </div>

                {/* Correo electrónico */}
                <div>
                    <label className="mb-2 block text-sm font-semibold ">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Ingresa el correo electrónico"
                        className="block w-full  bg-gray-950 py-1 px-2 text-white mb-5"
                        {...register("email", { required: "El correo electrónico es obligatorio" })}
                    />
                    {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                </div>

                {/* Username */}
                <div>
                    <label className="mb-2 block text-sm font-semibold ">Apodo</label>
                    <input
                        type="text"
                        placeholder="Ingresa el apodo"
                        className="block w-full  bg-gray-950 py-1 px-2 text-white mb-5"
                        {...register("username", { required: "El username es obligatorio" })}
                    />
                    {errors.username && <p className="text-red-800">{errors.username.message}</p>}
                </div>
                {/* Imagen de Perfil*/}
                <label className="mb-2 block text-sm font-semibold ">Imagen de Perfil</label>
                <div className="flex gap-4 mb-2">
                    
                    {/* Opción: Subir Imagen */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="upload"
                            {...register("imageOption", { required: !patient && "La imagen de perfil" })}
                            disabled={patient}
                        />
                        Subir Imagen
                    </label>
                    {errors.imageOption && <p className="text-red-800">{errors.imageOption.message}</p>}
                </div>

                {/* Subir Imagen */}
                {selectedOption === "upload" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Subir Imagen</label>
                        <input
                            type="file"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                            {...register("imagen")}
                        />
                    </div>
                )}

            </fieldset>


            {/* Botón de submit */}
            <input
                type="submit"
                className="bg-black w-full p-2 mt-5 text-[#20B2AA] uppercase font-bold rounded-lg 
                hover:bg-[#20B2AA] hover:text-black cursor-pointer transition-all"
                value={patient ? "Actualizar" : "Registrar"}
            />
        </form>

    )
}