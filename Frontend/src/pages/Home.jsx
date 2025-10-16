import { Link } from "react-router-dom";
import Header from "../components/principal/Header";
import Footer from "../components/principal/Footer";
import Logo from "../assets/logo.png"; 
import VideoInicio from "../assets/IA.mp4"; // tu video
import ChatImage from "../assets/logo.png"; 
import WhatsImage from "../assets/Whats.png"; 
import { useState, useEffect } from "react";

export const Home = () => {
  const fullTexto = "Jezt IA.";
  const colors = ["#20B2AA", "#3084c9ff", "#6A5ACD"];

  const [displayedText, setDisplayedText] = useState("");
  const [colorIndex, setColorIndex] = useState(0);

  // Efecto de escritura tipo máquina
  useEffect(() => {
    let i = 0;
    const intervaloTiempo = setInterval(() => {
      setDisplayedText(fullTexto.slice(0, i + 1));
      i++;
      if (i === fullTexto.length) clearInterval(intervaloTiempo);
    }, 200);
    return () => clearInterval(intervaloTiempo);
  }, []);

  // Cambio de color con transición suave
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);
  
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
      {/* Sección principal con video de fondo */}
      <main className="relative w-full h-[70vh] overflow-hidden">
        {/* Video de fondo */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={VideoInicio}
          autoPlay
          muted
          loop
        />

        {/* Contenido encima del video */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
           <br />
            <span
              style={{
                color: colors[colorIndex],
                fontWeight: "bold",
                fontSize: "2rem",
                transition: "color 0.8s ease",
                fontFamily: 'Gowun Batang, serif'
              }}
            >
              {displayedText}
            </span>
          </h1>
          <img src={Logo} alt="JEZT Logo" className="w-52 h-auto mt-6" />
          <Link
            to="/Login"
            className="mt-8 inline-block bg-[#20B2AA] text-black font-semibold  shadow-lg hover:bg-black hover:text-[#20B2AA] px-6 py-3  transition"
            style={imputSyle}
          >
            Probar Gratis
          </Link>
        </div>
      </main>

      {/* Sección de Chat con IA */}
      <section className="bg-black text-white px-8 md:px-16 lg:px-24 py-16 border-t border-gray-800" style={imputSyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna izquierda */}
          <div className="flex flex-col justify-center space-y-6 pr-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Chat con <span className="text-[#20B2AA]">IA</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              JEZT IA combina la automatización de mensajes en WhatsApp con un chat
              potenciado por inteligencia artificial. <br /><br />
              Con JEZT podrás ahorrar tiempo, optimizar la comunicación y brindar
              soporte instantáneo con la ayuda de un asistente virtual.
            </p>
          </div>

          {/* Columna derecha */}
          <div className="flex justify-center">
            <img src={ChatImage} alt="Chat con IA" className="rounded-xl shadow-lg w-80 md:w-[22rem]" />
          </div>
        </div>
      </section>

      {/* Sección de Automatización de WhatsApp */}
      <section className="bg-black text-white px-8 md:px-16 lg:px-24 py-16 border-t border-gray-800" style={imputSyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna izquierda */}
          <div className="flex flex-col justify-center space-y-6 pr-8">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Automatiza <br />
              <span className="text-[#20B2AA]">WhatsApp</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Configura envíos programados, respuestas automáticas y campañas personalizadas
              sin necesidad de estar conectado todo el tiempo.
            </p>
          </div>

          {/* Columna derecha */}
          <div className="flex justify-center pl-8">
            <img src={WhatsImage} alt="WhatsApp Automation" className="rounded-xl shadow-lg w-80 md:w-[22rem]" />
          </div>
        </div>
      </section>

     
    </>
  );
};

const imputSyle = { fontFamily: 'Gowun Batang, serif'}
export default Home;
