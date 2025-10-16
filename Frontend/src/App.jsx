import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import PrivateRouteWithRole from "./routes/PrivateRouteWithRole";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import storeProfile from "./context/storeProfile";
import storeAuth from "./context/storeAuth";

// Layouts
import Dashboard from "./layout/Dashboard";

// Components
import Header from "./components/principal/Header";
import Footer from "./components/principal/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import { Forgot } from "./pages/Forgot";
import { Confirm } from "./pages/Confirm";
import { NotFound } from "./pages/NotFound";
import Reset from "./pages/Reset";
import IA from "./pages/IA";
import JeztIA from "./pages/JeztIA";
import Automatizacion from "./pages/Automatizacion";
import AuthCallback from "./context/AuthCallBack";

import Profile from "./pages/Profile";
import Create from "./pages/Create";
import List from "./components/list/Table";
import Details from "./pages/Details";

import Whats from "./pages/Dashboard_whatsapp";
import Chat from "./pages/Chat_Historial";
import Formularios from "./pages/Formularios";

// 🔹 Componente auxiliar para ocultar header/footer en login y register
const LayoutWithConditionalHeaderFooter = ({ children }) => {
  const location = useLocation();

  // Rutas donde NO se debe mostrar el header/footer
  const hideHeaderFooterRoutes = [
    "/login",
    "/register",
    "/forgot",
    "/reset",
    "/confirm",
  ];

  const shouldHide = hideHeaderFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHide && <Header />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  const { profile } = storeProfile();
  const { token } = storeAuth();

  useEffect(() => {
    if (token) profile();
  }, [token]);

  return (
    <BrowserRouter>
      <LayoutWithConditionalHeaderFooter>
        <Routes>
          {/* 🔹 Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot/:id" element={<Forgot />} />
            <Route path="confirm/:token" element={<Confirm />} />
            <Route path="reset/:token" element={<Reset />} />
            <Route path="ia" element={<IA />} />
            <Route path="jeztia" element={<JeztIA />} />
            <Route path="automatizacion" element={<Automatizacion />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* 🔹 Rutas protegidas */}
          <Route
            path="dashboard/*"
            element={
              <ProtectedRoute>
                <Routes>
                  {/* Páginas generales del dashboard */}
                  <Route path="home" element={<Home />} />
                  <Route path="jeztia" element={<JeztIA />} />
                  <Route path="automatizacion" element={<Automatizacion />} />

                  {/* Layout principal del Dashboard */}
                  <Route element={<Dashboard />}>
                    <Route index element={<Profile />} />
                    <Route path="create" element={<Create />} />
                    <Route path="listar" element={<List />} />
                    <Route
                      path="visualizar/estudiante/:id"
                      element={<Details />}
                    />
                    <Route
                      path="visualizar/pasante/:id"
                      element={<Details />}
                    />
                    <Route path="whatsapp" element={<Whats />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="formularios" element={<Formularios />} />
                    <Route path="ia" element={<IA />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutWithConditionalHeaderFooter>
    </BrowserRouter>
  );
}

export default App;
