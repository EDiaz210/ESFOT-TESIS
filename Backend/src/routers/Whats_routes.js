import { Router } from "express";
import upload from "../middlewares/Upload.js";
import { getQR, getStatus, sendMessage, listaMensajes } from "../controllers/Whatsapp_controller.js";

const router = Router();

router.get("/qr", getQR);
router.get("/status", getStatus);
router.post("/send-message", upload.array("files"), sendMessage);
router.get("/listarmensajes", listaMensajes)

export default router;