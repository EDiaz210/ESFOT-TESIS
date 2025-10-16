import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToRegister = (userMail, token) => {
    let mailOptions = {
        from: 'jezt.studio@gmail.com',
        to: userMail,
        subject: "Bienvenido a Jezt - Confirma tu cuenta",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 30px; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="cid:logo" alt="Jezt Studio Logo" style="width: 120px; margin-bottom: 20px;" />
                <h1 style="color: #a0a0a0;">Bienvenido a Jezt</h1>
                <p style="font-size: 16px;">Has sido elegido para unirte a la experiencia JEZT. Antes de automatizar tus mensajes en WhatsApp y conversar con la inteligencia de un chat impulsado por IA, debes activar tu conexión haciendo clic en el botón.</p>
                <a href="${process.env.URL_FRONTEND}confirm/${token}" 
                    style="display: inline-block; padding: 12px 25px; margin-top: 20px; font-size: 16px; background-color: #4b4b4b; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Confirmar Cuenta
                </a>
            </div>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #333;">
            <footer style="text-align: center; font-size: 14px; color: #aaaaaa;">
                Jezt Studio © 2025 — Lo divertido comienza ahora.
            </footer>
        </div>
        `,
        attachments: [
            {
                filename: 'logo.jpg',
                path: path.join(__dirname, '../config/images/logo.jpg'),
                cid: 'logo' 
            }
        ]
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId)
        }
    })
}

const sendMailToRecoveryPassword = async(userMail, token) => {
    let info = await transporter.sendMail({
        from: 'jezt.studio@gmail.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 30px; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="cid:logo" alt="Jezt Studio Logo" style="width: 100px; margin-bottom: 20px;" />
                <h1 style="color: #a0a0a0;">Reestablecer contraseña</h1>
                <p style="font-size: 16px;">Haz clic en el botón para restablecer tu contraseña:</p>
                <a href="${process.env.URL_FRONTEND}reset/${token}" 
                    style="display: inline-block; padding: 12px 25px; margin-top: 20px; font-size: 16px; background-color: #4b4b4b; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Reestablecer Contraseña
                </a>
            </div>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #333;">
            <footer style="text-align: center; font-size: 14px; color: #aaaaaa;">
                El equipo de Jezt Studio está aquí para ayudarte.
            </footer>
        </div>
        `,
        attachments: [
            {
                filename: 'logo.jpg',
                path: path.join(__dirname, '../config/images/logo.jpg'),
                cid: 'logo'
            }
        ]
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId)
}

const sendMailToRecoveryPasswordAdmin = async(userMail, token) => {
    let info = await transporter.sendMail({
        from: 'jezt.studio@gmail.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 30px; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="cid:logo" alt="Delta Studio Logo" style="width: 100px; margin-bottom: 20px;" />
                <h1 style="color: #a0a0a0;">Reestablecer contraseña</h1>
                <p style="font-size: 16px;">Haz clic en el botón para restablecer tu contraseña:</p>
                <a href="${process.env.URL_BACKEND}recuperarpasswordAdmin/${token}" 
                    style="display: inline-block; padding: 12px 25px; margin-top: 20px; font-size: 16px; background-color: #4b4b4b; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Reestablecer Contraseña
                </a>
            </div>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #333;">
            <footer style="text-align: center; font-size: 14px; color: #aaaaaa;">
                El equipo de Jezt Studio recuperando la clave.
            </footer>
        </div>
        `,
        attachments: [
            {
                filename: 'logo.jpg',
                path: path.join(__dirname, '../config/images/logo.jpg'),
                cid: 'logo'
            }
        ]
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId)
}

const sendMailToOwner =  async (userMail, password) => {

    let info = await transporter.sendMail({
    from: 'jezt.studio@gmail.com',
    to: userMail,
    subject: "Correo de contraseña",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 30px; border-radius: 10px;">
            <div style="text-align: center;">
            <img src="cid:logo" alt="Jezt Studio Logo" style="width: 100px; margin-bottom: 20px;" />
            <h1 style="color: #a0a0a0;"> Contraseña</h1>
            <p style="font-size: 16px;">Bienvenido a Jezt, estas son tus credenciales de acceso:</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <a href="${process.env.URL_FRONTEND}login" 
                    style="display: inline-block; padding: 12px 25px; margin-top: 20px; font-size: 16px; background-color: #4b4b4b; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Iniciar sesión
            </a>
            </div>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #333;">
            <footer style="text-align: center; font-size: 14px; color: #aaaaaa;">
                El equipo de Jezt Studio recuperando la clave.
            </footer>
        </div>
    `,
    attachments: [
            {
                filename: 'logo.jpg',
                path: path.join(__dirname, '../config/images/logo.jpg'),
                cid: 'logo'
            }
        ]
});

}




export
{
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToRecoveryPasswordAdmin,
    sendMailToOwner
}
