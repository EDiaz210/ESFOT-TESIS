import express from "express";
import {
  chatPrincipal,
  historialUsuario,
} from "../controllers/Conversaciones_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = express.Router();


router.post("/chat", verificarTokenJWT, chatPrincipal);
router.get("/historial", verificarTokenJWT, historialUsuario);

export default router;

