import { client, lastQR, isReady } from "../config/client.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import { normalizeNumber } from "../utils/normalize.js";
import Mensaje from "../models/Mensaje.js";

const getQR = async (req, res) => {
  if (isReady) return res.json({ ready: true, qr: null });
  if (!lastQR) {
    return res.status(404).json({ ready: false, error: "QR aún no generado." });
  }
  res.json({ ready: false, qr: lastQR });
};

const getStatus = (req, res) => {
  res.json({ ready: isReady });
};

const sendMessage = async (req, res) => {
  try {
    if (!isReady) {
      return res
        .status(503)
        .json({ error: "WhatsApp no está listo. Escanea el QR en /qr." });
    }

    const message = req.body.message || "";
    let numbers = req.body.numbers || req.body["numbers[]"] || [];
    if (!Array.isArray(numbers)) numbers = [numbers];
    numbers = numbers.map((n) => normalizeNumber(n)).filter(Boolean);

    if (!message && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Debes enviar 'message' o al menos un archivo." });
    }

    if (!numbers.length) {
      return res.status(400).json({ error: "No hay números válidos." });
    }

    const allowedTipos = ["Administrativas", "Académicas", "Extracurriculares"];
    const tipoFromReq = req.body.tipo;
    if (!allowedTipos.includes(tipoFromReq)) {
      return res.status(400).json({
        error: "El campo 'tipo' debe ser Administrativas, Académicas o Extracurriculares.",
      });
    }

    const files = (req.files || []).map(file => {
      const base64 = file.buffer.toString("base64");
      return {
        media: new MessageMedia(file.mimetype, base64, file.originalname),
        fileName: file.originalname,
        fileMime: file.mimetype,
      };
    });

    const results = [];
    for (const chatId of numbers) {
      try {
        if (message) {
          await client.sendMessage(chatId, message);
        }
        for (const file of files) {
          await client.sendMessage(chatId, file.media, {
            caption: message, 
          });
        }
      } catch (err) {
        console.error(`Error enviando a ${chatId}:`, err);
        results.push({ to: chatId, sent: false, error: String(err) });
      }
    }

    const nuevoMensaje = new Mensaje({
      numbers, 
      message,
      hasMedia: files.length > 0,
      files: files.map(f => ({ fileName: f.fileName, fileMime: f.fileMime })),
      tipo: tipoFromReq,
      date: new Date(),
    });

    await nuevoMensaje.save();

    numbers.forEach(n => results.push({ to: n, sent: true }));

    res.json({ ok: true, results });
  } catch (e) {
    console.error("Error /send-message:", e);
    res.status(500).json({ error: String(e) });
  }
};



const listaMensajes = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin } = req.query;
    const filtro = { status: true };

    if (tipo) {
      filtro.tipo = tipo; 
    }

    if (fechaInicio || fechaFin) {
      filtro.date = {};
      if (fechaInicio) filtro.date.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.date.$lte = new Date(fechaFin);
    }

    const mensajes = await Mensaje.find(filtro)
      .select("-__v") 
      .sort({ date: -1 });

    res.status(200).json(mensajes);
  } catch (error) {
    console.error("Error al listar mensajes:", error);
    res.status(500).json({ error: "Error al listar mensajes" });
  }
};




export { getQR, getStatus, sendMessage, listaMensajes };
