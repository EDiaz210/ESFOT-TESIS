import { useState, useMemo } from "react";
import {
  MessageSquare,
  BarChart2,
  Clock,
  Eye,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatDistanceToNow, parse } from "date-fns";
import { saveAs } from "file-saver";

const Chat = () => {
  const faqsData = [
    {
      id: 1,
      category: "Matrícula",
      question: "¿Cómo me inscribo en un curso?",
      answer:
        "Debes acceder al portal académico y dirigirte a la sección de matrículas.",
      frequency: 15,
      lastAsked: "2025-09-16 10:15",
      image: null,
    },
    {
      id: 2,
      category: "Horarios",
      question: "¿Dónde consulto mi horario?",
      answer:
        "El horario se encuentra disponible en la sección 'Mi perfil académico'.",
      frequency: 10,
      lastAsked: "2025-09-15 15:00",
      image: null,
    },
    {
      id: 3,
      category: "Certificados",
      question: "¿Cómo solicito un certificado?",
      answer:
        "Debes generar la solicitud en la plataforma de trámites en línea.",
      frequency: 7,
      lastAsked: "2025-09-14 12:00",
      image: null,
    },
    {
      id: 4,
      category: "Clases",
      question: "¿Cuándo comienzan las clases?",
      answer:
        "El calendario académico indica las fechas de inicio de cada semestre.",
      frequency: 12,
      lastAsked: "2025-09-16 09:00",
      image: null,
    },
    {
      id: 5,
      category: "Docentes",
      question: "¿Cómo contacto a un docente?",
      answer:
        "Puedes enviar un mensaje desde el portal académico en la sección 'Contactar docente'.",
      frequency: 5,
      lastAsked: "2025-09-16 08:30",
      image: null,
    },
  ];

  const [faqs] = useState(faqsData);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const toggleAnswer = (id) => setOpenId(openId === id ? null : id);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) =>
      f.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const exportCSV = () => {
    const csv = ["Pregunta,Respuesta,Categoría,Popularidad,Última vez"];
    faqs.forEach((f) => {
      csv.push(
        `"${f.question}","${f.answer}","${f.category}",${f.frequency},"${f.lastAsked}"`
      );
    });
    const blob = new Blob([csv.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, "faqs.csv");
  };

  return (
    <div className="bg-[#111111] text-white flex h-screen w-screen font-sans">

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-black border-b border-gray-800 flex justify-between items-center px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#20B2AA]" />
            <h2 className="text-xl font-bold text-[#20B2AA] tracking-wide">
              Preguntas Frecuentes de Estudiantes
            </h2>
          </div>
        </header>

        {/* Barra de búsqueda */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <input
            type="text"
            placeholder="Buscar preguntas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white w-80 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            aria-label="Buscar preguntas"
          />
            <div className="flex items-center gap-4">
            <button
              onClick={exportCSV}
            className="px-5 py-2 bg-gradient-to-r from-[#20B2AA] to-[#3bd9d0] text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        

        {/* Lista de FAQs */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto grid gap-4">
            {filteredFaqs.map((faq) => {
              const lastAskedDate = parse(
                faq.lastAsked,
                "yyyy-MM-dd HH:mm",
                new Date()
              );
              const relativeTime = formatDistanceToNow(lastAskedDate, {
                addSuffix: true,
              });
              const trend = faq.frequency > 10 ? "up" : "down";

              return (
                <div
                  key={faq.id}
                  className="bg-gray-900 border border-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition relative"
                  role="region"
                  aria-labelledby={`faq-${faq.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      id={`faq-${faq.id}`}
                      className="font-semibold text-sm text-[#20B2AA]"
                    >
                      {faq.question}
                    </h3>
                    <button
                      onClick={() => toggleAnswer(faq.id)}
                      className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-800 text-[#20B2AA] flex items-center gap-1 hover:bg-gray-700 transition"
                      aria-expanded={openId === faq.id}
                      aria-controls={`answer-${faq.id}`}
                    >
                      {openId === faq.id ? (
                        <>
                          <X className="w-3 h-3" /> Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Ver
                        </>
                      )}
                    </button>
                  </div>

                  {openId === faq.id && (
                    <div
                      id={`answer-${faq.id}`}
                      className="text-sm mb-2 border-t border-gray-700 pt-2 flex flex-col gap-2"
                    >
                      <p>{faq.answer}</p>
                      {faq.image && (
                        <img
                          src={faq.image}
                          alt="Apoyo visual"
                          className="max-w-xs rounded"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" /> Última vez:{" "}
                      {relativeTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart2 className="w-4 h-4 text-gray-500" /> Popularidad:{" "}
                      {faq.frequency}{" "}
                      {trend === "up" ? (
                        <ArrowUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-400" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
