import { useState, useRef, useEffect } from "react";
import { FiPlus, FiTrash2, FiSend } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import Logo from "../assets/logo.png";
import axios from "axios";

const IA = () => {
  const auth = JSON.parse(localStorage.getItem("auth-token"));
  const token = auth?.state?.token || "";
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const fetchConversaciones = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/conversaciones/historial`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data || [];
        const adaptadas = data.map((c) => ({
          id: c._id,
          title: c.pregunta.slice(0, 30),
          messages: [
            { rol: c.usuarioTipo, contenido: c.pregunta },
            { rol: "IA", contenido: c.respuesta },
          ],
        }));

        setChats(adaptadas);
        if (adaptadas.length > 0) setSelectedChatId(adaptadas[0].id);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      }
    };

    if (token) fetchConversaciones();
  }, [token]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);


  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "Nueva conversación",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setInput("");
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (selectedChatId === id) setSelectedChatId(null);
  };


  const handleBuscar = async () => {
    if (!input.trim()) return;
    const pregunta = input.trim();

    try {
      // Mostrar mensaje del usuario
      const newMessage = { rol: "Tú", contenido: pregunta };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
      setInput("");

      // Enviar pregunta al backend con JWT
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/conversaciones/chat`,
        { question: pregunta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const respuesta = res.data.answer || "No tengo información suficiente.";

      // Mostrar respuesta IA
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { rol: "Jezt IA", contenido: respuesta },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error en la conversación:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBuscar();
    }
  };

  const currentChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-white overflow-hidden h-[900px] max-h-[1080px] mx-auto w-full max-w-8xl shadow-lg">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 border-r-2 border-sky-700 shadow-md p-4 flex flex-col">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 p-2 mb-4 text-sm font-semibold text-gray-100 bg-gradient-to-r from-blue-900 via-sky-800 to-sky-700 rounded hover:scale-105 transition-transform"
          >
            <FiPlus /> Nueva conversación
          </button>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-gray-100">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between gap-2 p-2 mb-2 text-sm rounded cursor-pointer transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-sky-600 text-white"
                    : "hover:bg-sky-600 text-gray-400"
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <BsChatDots />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main chat */}
        <main className="flex-1 flex flex-col bg-gray-950 text-white overflow-hidden">
          <section
            className="flex-1 p-6 overflow-y-auto flex flex-col"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex flex-col items-center">
              <img src={Logo} alt="Logo" style={{ width: "125px", height: "125px" }} />
              <h3 className="mt-4">Hola, soy Jezt IA </h3>
            </div>

            {currentChat &&
              currentChat.messages.map((msg, index) => {
                const esUsuario = msg.rol !== "Jezt IA";
                return (
                  <div
                    key={index}
                    className={`max-w-[70%] w-fit mb-3 px-5 py-3 rounded-lg shadow-sm whitespace-pre-wrap break-words ${
                      esUsuario
                        ? "bg-sky-700 text-gray-200 self-end"
                        : "bg-blue-950 text-gray-200 self-start"
                    }`}
                  >
                    {msg.contenido}
                  </div>
                );
              })}

            <div ref={messagesEndRef} />
          </section>

          {/* Input */}
          <footer className="bg-gray-950 p-4 border-t border-sky-700 flex items-center gap-2">
            <TextareaAutosize
              minRows={1}
              maxRows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Haz tu pregunta a Jezt IA"
              className="bg-gray-950 flex-1 border-2 border-sky-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-sky-600 transition-all text-gray-300"
            />
            <button
              onClick={handleBuscar}
              className="p-2 bg-sky-700 hover:bg-sky-600 rounded-lg text-white transition-colors"
            >
              <FiSend />
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default IA;
