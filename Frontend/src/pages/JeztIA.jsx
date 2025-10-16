import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/principal/Header";
import Footer from "../components/principal/Footer";
import Ban from "../assets/banner.png";

 const JeztIA = () => {
  const [hovered, setHovered] = useState(null);

  const products = [
    {
      id: "jezt-5",
      name: "JEZT",
      desc: "Modelo insignia con la mejor precisión para automatización y chat en WhatsApp.",
      status: "Disponible",
    },
    {
      id: "jezt-4.5",
      name: "JEZT",
      desc: "Gran equilibrio entre velocidad y costo. Ideal para empresas medianas.",
      status: "Lanzado 2025",
    },
    {
      id: "jezt-0",
      name: "JEZT",
      desc: "Optimizado para rapidez y consultas en tiempo real.",
      status: "Beta",
    },
  ];

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
    
    <div className="bg-black text-white min-h-screen" style={inputStyle}>
        <div className="bg-black text-white text-center py-6 ">
          <h1 className="text-4xl md:text-5xl font-bold">
            Chat Inteligente llamado  <span className="text-[#20B2AA]">JEZT IA</span>
          </h1>
          <p className="text-white mt-2 text-lg p-20">
                JEZT IA ayuda a resolver tus inquietudes academicas en cuanto  
                <span className="font-semibold"> Curriculares y Extracurriculares </span> de manera más personalizada.
          </p>
        </div>
        {/* Hero */}
        <section className="relative text-center bg-cover bg-center h-60 flex items-center justify-center" style={{ backgroundImage: `url(${Ban})` }}>
          {/* Overlay borroso */}
          <div className="absolute inset-0  bg-black/10"></div>
          {/* Botón encima */}
          <div className="relative z-10">
            <Link to = "/login">
              <button className="mt-30 px-6 py-3 bg-[#20B2AA] text-black font-semibold  shadow-lg hover:bg-black hover:text-[#20B2AA] transition">
                Probar ahora
              </button>
            </Link>
          </div>
        </section>


        {/* Productos */}
        <section className="py-20 px-6 md:px-20">
            <h3 className="text-3xl font-bold mb-10 text-center">Nuestros Modelos</h3>
            <div className="grid md:grid-cols-3 gap-8">
            {products.map((p) => (
                <motion.div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                className={`p-6 rounded-2xl bg-gradient-to-br from-[#20B2AA] via-gray-950 to-sky-900 shadow-lg cursor-pointer transform transition ${
                    hovered === p.id ? "scale-105" : ""
                }`}
                whileHover={{ y: -5 }}
                >
                <h4 className="text-2xl font-semibold">{p.name}</h4>
                <p className="mt-3 text-gray-200">{p.desc}</p>
                <span className="block mt-4 text-sm text-gray-300 italic">{p.status}</span>
                </motion.div>
            ))}
            </div>
        </section>
    </div>
    
  );
};

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};
export default JeztIA;