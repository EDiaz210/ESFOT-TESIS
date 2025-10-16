import { useState, useRef, useEffect} from "react";
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";
import { generateAvatar, convertBlobToBase64 } from "../../helpers/consultarIA";

export const CardProfile = () => {
    const { user, uploadAvatar, deleteAccount } = storeProfile();
    const { clearToken } = storeAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [iaImage, setIaImage] = useState(null);
    const fileInputRef = useRef(null);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleUploadImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await uploadAvatar(file, user._id);
            setShowMenu(false);
        } catch (error) {
            console.error("Error subiendo imagen:", error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
        );
        if (!confirmed) return;

        const response = await deleteAccount(user._id);
        if (response) {
            setTimeout(() => {
                clearToken();
            }, 2000);
        }
    };

    const handleGenerateIA = async () => {
        const description = window.prompt("Escribe una descripción para generar tu avatar:");
        if (!description) return;

        setGenerating(true);
        try {
            const blob = await generateAvatar(description);
            const base64img = await convertBlobToBase64(blob);
            setIaImage(base64img);

            if (window.confirm("Imagen generada. ¿Quieres usarla como avatar y subirla?")) {
                const res = await fetch(base64img);
                const file = await res.blob();
                const imageFile = new File([file], "avatarIA.png", { type: "image/png" });
                await uploadAvatar(imageFile, user._id);
                setIaImage(null);
                setShowMenu(false);
            }
        } catch (error) {
            console.error("Error generando imagen IA:", error);
            alert("Error al generar la imagen, intenta de nuevo.");
        } finally {
            setGenerating(false);
        }
    };

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
        <div className="bg-gray-950 h-auto p-4 flex flex-col items-center justify-between shadow-xl  py-1 px-2 pt-[50px] pb-[50px]">
            <div className="relative">
                <img
                    src={
                    getHDImage(user?.avatarUsuario) ||
                    "src/assets/usuarioSinfoto.jpg"
                }
                    alt={`Avatar de ${user?.nombre || "Usuario"}`}
                    className="h-40 w-40 rounded-full object-cover mx-auto"
                    
                />
                <label
                    onClick={toggleMenu}
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-[#20B2AA] select-none"
                    title="Opciones de imagen"
                >
                    📷
                </label>

                {showMenu && (
                    <div className="absolute bottom-12 right-0 bg-gray-800 p-3 rounded shadow-lg flex flex-col gap-2 z-50">
                        <button
                            className="text-white hover:bg-gray-700 px-3 py-1 rounded"
                            onClick={handleUploadImageClick}
                            disabled={generating}
                        >
                            Subir imagen
                        </button>
                        <button
                            className="text-white hover:bg-gray-700 px-3 py-1 rounded"
                            onClick={handleGenerateIA}
                            disabled={generating}
                        >
                            {generating ? "Generando..." : "Generar imagen por IA"}
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <div className="text-white text-center mt-6 space-y-2">
                <h2 className="text-2xl font-bold"style={{ fontFamily: 'Gowun Batang, serif' }}>{user?.nombre}</h2>
                <p className="text-sm text-gray-300"style={inputStyle}>{user?.email}</p>
                <p className="text-sm"style={inputStyle}>
                    Rol:{" "}
                    <span className="uppercase font-semibold text-[#20B2AA] ">
                        {user?.rol}
                    </span>
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-[50px] w-full max-w-md mx-auto"style={inputStyle}>
                <div className="flex items-center gap-1 text-white">
                    <b>Estado:</b>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-green-500 text-xs font-medium">
                            {user?.status ? "Activo" : "Inactivo"}
                        </p>
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-black px-3 py-1 text-white text-sm uppercase font-bold hover:bg-[#20B2AA] hover:text-black cursor-pointer transition-all"
                >
                    Eliminar Cuenta
                </button>
            </div>
        </div>
    );
};

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};

export default CardProfile;
