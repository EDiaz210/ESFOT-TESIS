import axios from "axios";
import dotenv from "dotenv";
import Conversacion from "../models/Conversaciones.js";

dotenv.config();
export const chatPrincipal = async (req, res) => {
  try {
    const { question } = req.body;


    let usuario = null;
    let tipoUsuario = "";

    if (req.administradorBDD) {
      usuario = req.administradorBDD;
      tipoUsuario = "Administrador";
    } else if (req.estudianteBDD) {
      usuario = req.estudianteBDD;
      tipoUsuario = "Estudiante";
    } else if (req.pasanteBDD) {
      usuario = req.pasanteBDD;
      tipoUsuario = "Pasante";
    } else {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!question?.trim())
      return res.status(400).json({ error: "La pregunta no puede estar vacía" });
    const { data } = await axios.post(`${process.env.RAG_URL}/ask`, {
      query: question,
    });

    const respuesta = data.respuesta || "No tengo información suficiente.";
    const contexto = data.contexto || [];


    await Conversacion.create({
      usuarioId: usuario._id,
      usuarioTipo: tipoUsuario,
      pregunta: question,
      respuesta,
      contexto: contexto.map((r) => ({
        url: r.url,
        relevancia: 1,
      })),
    });

    res.json({
      ok: true,
      answer: respuesta,
      rol: tipoUsuario,
      usuario: usuario.nombre || "Usuario",
    });
  } catch (e) {
    console.error(" Error en chatPrincipal:", e);
    res.status(500).json({ error: "Error procesando conversación" });
  }
};


export const historialUsuario = async (req, res) => {
  try {
    let usuario = null;

    if (req.administradorBDD) usuario = req.administradorBDD;
    else if (req.estudianteBDD) usuario = req.estudianteBDD;
    else if (req.pasanteBDD) usuario = req.pasanteBDD;
    else return res.status(401).json({ error: "Usuario no autenticado" });

    const chats = await Conversacion.find({ usuarioId: usuario._id })
      .sort({ fecha: -1 })
      .limit(50);

    res.json(chats);
  } catch (e) {
    console.error("Error al obtener historial:", e);
    res.status(500).json({ error: "Error al obtener historial" });
  }
};
