import {crearTokenJWT} from '../middlewares/JWT.js'
import dotenv from "dotenv";

dotenv.config();
// GOOGLE CALLBACK
const googleCallback = (req, res) => {
try {
      if (!req.user) {
        console.error('No se recibió usuario de Passport en Google callback');
        return res.redirect(`${process.env.URL_FRONTEND}auth/callback?error=No se pudo autenticar con Google`);
      }

      const estudiante  = req.user;

      if (estudiante.status === false) {
        return res.redirect(`${process.env.URL_FRONTEND}auth/callback?error=Cuenta suspendida`);
      }

      const token = crearTokenJWT( estudiante._id, estudiante.rol )
        

      const redirectUrl =
        `${process.env.URL_FRONTEND}auth/callback?` +
        `token=${token}&` +
        `nombre=${encodeURIComponent(estudiante.nombre)}&` +
        `email=${encodeURIComponent(estudiante.email)}&` +
        `rol=${estudiante.rol}`;

      return res.redirect(redirectUrl);

    } catch (err) {
      console.error('Error en Google callback:', err);
      return res.redirect(`${process.env.URL_FRONTEND}auth/callback?error=Error interno del servidor`);
    }
};

export default googleCallback;
