import React, { useState, useEffect } from "react";
import { PaperClipIcon, UsersIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import usuarioSinfoto from "../../assets/usuarioSinfoto.jpg";

const tiposMensajes = ["Administrativas", "Académicas", "Extracurriculares"];

const Sidebar = ({ onSelectMessage }) => {
  const [search, setSearch] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({
    Hoy: true,
    Ayer: true,
    "Esta semana": true,
    Anteriores: true,
  });
  const [tipo, setTipo] = useState("");

  const fetchMensajes = async (tipoFiltro = "") => {
    try {
      const url = tipoFiltro
        ? `http://localhost:3000/api/listarmensajes?tipo=${tipoFiltro}`
        : "http://localhost:3000/api/listarmensajes";
      const { data } = await axios.get(url);
      setMensajes(data);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  useEffect(() => {
    fetchMensajes(tipo);
  }, [tipo]);

  const filteredHistory = mensajes.filter((item) =>
    item.numbers.some((num) => num.includes(search))
  );

  // ✅ Mantiene agrupación correcta
  const groupByTime = (messages) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const groups = { Hoy: [], Ayer: [], "Esta semana": [], Anteriores: [] };

    messages.forEach((msg) => {
      const msgDate = new Date(msg.date);
      const msgDay = new Date(
        msgDate.getFullYear(),
        msgDate.getMonth(),
        msgDate.getDate()
      );

      const diffDays = Math.floor((today - msgDay) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) groups.Hoy.push(msg);
      else if (diffDays === 1) groups.Ayer.push(msg);
      else if (diffDays <= 7) groups["Esta semana"].push(msg);
      else groups.Anteriores.push(msg);
    });

    return groups;
  };

  const groupedMessages = groupByTime(filteredHistory);

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      className="w-80 flex flex-col border-r border-gray-800 bg-gray-950 shadow-sm font-sans"
      style={inputStyle}
    >
      {/* Header fijo */}
      <div className="sticky top-0 z-10 px-2 py-3 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] border-b border-gray-800 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-white text-center">
          Historial de Mensajes
        </h2>

        {/* Botones tipo */}
        <div className="flex gap-2 mt-2 justify-center flex-wrap">
          {tiposMensajes.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                tipo === t
                  ? "bg-[#20B2AA] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
          {tipo && (
            <button
              onClick={() => setTipo("")}
              className="px-3 py-1 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Búsqueda */}
        <div className="relative w-full mt-2">
          <input
            type="text"
            placeholder="Buscar por número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-md bg-gray-900 text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#20B2AA] flex items-center justify-center text-white text-xs shadow hover:bg-teal-400 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Lista de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto py-2 px-2 max-h-[calc(100vh-160px)]">
        {Object.keys(groupedMessages).map(
          (group) =>
            groupedMessages[group].length > 0 && (
              <div key={group} className="mb-2">
                <div
                  className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-800 rounded-md transition"
                  onClick={() => toggleGroup(group)}
                >
                  <span className="text-gray-400 text-xs font-semibold uppercase">
                    {group}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform ${
                      expandedGroups[group] ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                {expandedGroups[group] &&
                  groupedMessages[group].map((msg) => (
                    <div
                      key={msg._id}
                      onClick={() => onSelectMessage(msg)}
                      className="flex items-start gap-3 px-4 py-2 mb-1 rounded-md hover:bg-gray-800 cursor-pointer transition-shadow shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shadow mt-1 border border-gray-700">
                        <img
                          src={usuarioSinfoto}
                          alt="usuario"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white truncate">
                            {msg.message.split(" ").slice(0, 5).join(" ")}...
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300 truncate">
                          {msg.message}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3" />
                            {msg.numbers.length}
                          </span>
                          {msg.files?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <PaperClipIcon className="w-3 h-3" />
                              {msg.files.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

const inputStyle = { fontFamily: "Gowun Batang, serif" };
export default Sidebar;

