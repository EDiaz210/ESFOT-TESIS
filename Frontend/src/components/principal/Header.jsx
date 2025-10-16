import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import { NavLink } from "react-router-dom";
import storeProfile from '../../context/storeProfile'


export const Header = () => {
  const user = storeProfile(state => state.user);
  const clearUser = storeProfile(state => state.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  
  const handleLogin = () => { navigate('/login'); window.location.reload(); };
  const handleRegister = () => { navigate('/register'); window.location.reload(); };
  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("auth-token");
    navigate('/')
    window.location.reload();
  };
  const toggleMenu = () => { setMenuOpen(!menuOpen); };

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
      <style>{`
        /* Reset UL */
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Header base */
        header {
          position: relative;
          width: 100%;
          background-color: black;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
        }

        /* Logo */
        .logo img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        /* Botón hamburguesa móvil */
        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          width: 30px;
          height: 24px; /* altura ajustada para que quepan 3 líneas de 3px con espacios */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          box-sizing: border-box;
          z-index: 20;
        }

        .menu-toggle span {
          display: block;
          position: relative;  /* esto es clave */
          width: 100%;
          height: 3px;
          background-color: #ddd;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .menu-toggle span::before,
        .menu-toggle span::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: #ddd;
          border-radius: 2px;
          transition: all 0.3s ease;
          left: 0;
        }

        .menu-toggle span::before {
          top: -8px; /* 8px arriba de la barra central */
        }

        .menu-toggle span::after {
          top: 8px; /* 8px abajo de la barra central */
        }

        .menu-toggle.open span {
          background-color: transparent;
        }

        .menu-toggle.open span::before {
          transform: rotate(45deg);
          top: 0;
        }

        .menu-toggle.open span::after {
          transform: rotate(-45deg);
          top: 0;
}




        /* Cuando está abierto, animamos la X */
        .menu-toggle.open span {
          background-color: transparent;
        }
        .menu-toggle.open span::before {
          transform: rotate(45deg);
          top: 0;
        }
        .menu-toggle.open span::after {
          transform: rotate(-45deg);
          top: 0;
        }

        /* Menú navegación móvil - oculto por defecto */
        nav {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background-color: #1a1a1a;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          z-index: 10;
        }

        nav.open {
          max-height: 300px; /* Ajusta según cantidad de items */
        }

        nav ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem 1.5rem;
        }

        nav ul li a {
          color: #ddd;
          text-decoration: none;
          font-size: 1.2rem;
          transition: color 0.3s ease;
          position: relative;
        }

        nav ul li a:hover,
        nav ul li a.active {
          color: #fff;
        }

        /* Desktop styles - a partir de 768px */
        @media(min-width: 768px) {
          header {
            padding: 0 2rem;
          }

          .menu-toggle {
            display: none;
          }

          nav {
            position: static;
            max-height: none;
            background: none;
            overflow: visible;
          }

          nav ul {
            flex-direction: row;
            gap: 2rem;
            padding: 0;
          }

          nav ul li a {
            font-size: 1rem;
          }
        }

        /* Botones */
        .buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn {
          background-color: #2C2B38;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 0.9rem;
        }
        .btn:hover {
          background-color: rgba(138, 43, 226, 0.1);
          color: #20B2AA;
        }
        .btn.logout {
          background-color: #333;
        }
        .btn.logout:hover {
          background-color: #444;
        }
      `}</style>

      <header style={inputStyle}>
        <div className="logo">
          <NavLink to={isLoggedIn ? "/dashboard/home" : "/"} >
                <img src={logo} alt="Logo" className="w-20 h-auto" />
          </NavLink>

        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
        </button>

        {/* Menú navegación */}
        <nav className={menuOpen ? 'open' : ''}>
      <ul>

        <li>
          <NavLink to={isLoggedIn ? "/dashboard/jeztia" : "/jeztia"} className={({ isActive }) => isActive ? 'active' : ''}>
            Jezt IA
          </NavLink>
        </li>

        {isLoggedIn && (
          <>
          <li>
            <NavLink to={isLoggedIn ? "/dashboard" : "/dashboard"} className={({ isActive }) => isActive ? 'active' : ''}>
              Panel
            </NavLink>
          </li>
          </>
        )}

        <li>
          <NavLink to={isLoggedIn ? "/dashboard/automatizacion" : "/automatizacion"} className={({ isActive }) => isActive ? 'active' : ''}>
            Automatización 
          </NavLink>
        </li>
          </ul>
        </nav>

        {/* Botones login/registro o logout */}
        <div className="buttons">
          {isLoggedIn ? (
            <>
              <button className="btn logout" onClick = { handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={handleLogin}>Iniciar Sesión</button>
              <button className="btn" onClick={handleRegister}>Registrarse</button>
            </>
          )}
        </div>
      </header>
    </>
  );
};

const inputStyle = {
  fontFamily: 'Gowun Batang, serif'
};
export default Header;
