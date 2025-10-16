import Facebook from '../../assets/Facebook.png'
import Correo from '../../assets/Correo.png'
import Youtube from '../../assets/Youtube.png'
import Instagram from '../../assets/Instagram.png'
import X from '../../assets/X.png'
import Linkedin from '../../assets/Linkedin.png'
import Jezt from '../../assets/logo.png'
import {useEffect } from "react";

const Footer = () => {
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
    <footer className="bg-black text-white py-10 px-4" style={inputStyle}>
      
      {/* Menú superior */}
      <div className="bg-gray-950 py-4 flex flex-col items-center gap-3 text-sm  md:flex-row md:justify-center md:gap-8">
        <a href="/">ACERCA DE JEZT </a>
        <a href="/Asistencia">AYÚDANOS A MEJORAR</a>
        <a href="/Asistencia">ASISTENCIA</a>
        <a 
          href="https://play.google.com/store/games?hl=es_EC&pli=1" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          APLICACIÓN PARA MÓVIL
        </a>
      </div>

      {/* Sección central */}
      <div className="text-center my-10">
        
        {/* Íconos sociales */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {[ 
            {src: Facebook, alt: "Facebook", link: "https://www.facebook.com/your-page"},
            {src: Correo, alt: "Correo", link: "mailto:my.delta.studio@gmail.com"},
            {src: Youtube, alt: "YouTube", link: "https://www.youtube.com/@yourchannel"},
            {src: Instagram, alt: "Instagram", link: "https://www.instagram.com/yourprofile"},
            {src: X, alt: "X", link: "https://x.com/yourprofile"},
          ].map((item, idx) => (
            <a 
              key={idx}
              href={item.link}
              target={item.link.startsWith("http") ? "_blank" : undefined}
              rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={item.alt}
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                className="w-6 h-6"
                style={{ filter: 'invert(38%) sepia(0%) saturate(0%) hue-rotate(316deg) brightness(92%) contrast(85%)'}}
              />
            </a>
          ))}
        </div>

        {/* Logo y nombre */}
        <div className="flex flex-col items-center gap-2 mb-4 md:flex-row md:justify-center">
          <img
            src={Jezt}
            alt="Jezt Logo"
            className="w-14 h-14"
            style={{ filter: 'invert(27%) sepia(2%) saturate(0%) hue-rotate(345deg) brightness(95%) contrast(90%)'}}
          />
          <span 
            className="text-lg font-bold text-center md:text-left" 
            style={{ color: '#635f5f' }}
          >
            <br/>JEZT STUDIO
          </span>
        </div>

        {/* Derechos */}
        <p 
          className="text-gray-400 max-w-md mx-auto text-sm" 
          style={{color: '#635f5f'}}
        >
          Todos los derechos reservados por Jezt Studio y documentación es una
          marca registrada por Jezt Studio
        </p>
      </div>

      {/* Integrantes */}
      <div className="flex flex-col items-center gap-8 text-center text-gray-300 md:flex-row md:justify-center md:gap-16" style={{ color: '#635f5f' }}>
        {[
          {
            name: "Elkin Díaz",
            email: "elkin.diaz@epn.edu.ec",
            linkedin: "https://www.linkedin.com/in/elkin-diaz"
          },
          {
            name: "Justin Imbaquingo",
            email: "justin.imbaquingo@epn.edu.ec",
            linkedin: "https://www.linkedin.com/in/edwin-sarango"
          },
          
        ].map((person, idx) => (
          <div key={idx}>
            <p className="mb-2 font-semibold">{person.name}</p>
            <div className="flex flex-col gap-2 items-center">
              {/* Correo */}
              <a href={`mailto:${person.email}`} aria-label={`Enviar correo a ${person.name}`}>
                <img 
                  src={Correo} 
                  alt="Correo" 
                  className="w-6 h-6"
                  style={{ filter: 'invert(38%) sepia(0%) saturate(0%) hue-rotate(316deg) brightness(92%) contrast(85%)'}}
                />
              </a>

              {/* LinkedIn */}
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`Ver perfil de LinkedIn de ${person.name}`}>
                <img 
                  src={Linkedin} 
                  alt="LinkedIn" 
                  className="w-6 h-6"
                  style={{ filter: 'invert(38%) sepia(0%) saturate(0%) hue-rotate(316deg) brightness(92%) contrast(85%)'}}
                />
              </a>
            </div>
          </div>
        ))}
      </div>

    </footer>
  );
};

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};

export default Footer;
