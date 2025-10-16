import express from "express"; //framework
import dotenv from "dotenv";
import cors from "cors"; //sirve para conectar el backend y frontend con codigo de area
import routerEstudiante from './routers/Estudiante_routes.js'
import routerAdministrador from './routers/Administrador_routes.js'
import routerPasante from './routers/Pasante_routes.js'
import routerWhats from './routers/Whats_routes.js'
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"
import session from "express-session";
import passport from "passport";
import routerAuth from "./routers/Auth_routes.js"
import './config/passport.js';
import http from "http"
import {Server} from "socket.io"
import conversacionesRoutes from "./routers/Conversaciones_routes.js";



//Inicializaciones
const app = express()
dotenv.config()

app.use(session({
    secret: process.env.MONGODB_URI_LOCAL, 
    saveUninitialized: false,
    resave:false
}));


app.use(passport.initialize());
app.use(passport.session());


//app.set('port', process.env.CLOUDINARY || 3000) //process es paara datos sensibles
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

//cloudinary para la base de datos
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use(cors(corsOptions));

// Rutas para mensajes
app.use("/api", routerWhats);

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

//Configuraciones
app.set('port', process.env.PORT || 3000) 


app.use(express.json()); //guarda la informacion del frontend en un archivo json para procesar el backend
app.use(express.urlencoded({ extended: true }));


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})


//Rutas para administradores
app.use('/api',routerAdministrador)

// Rutas para estudiantes
app.use('/api',routerEstudiante)

// Rutas para pasantes
app.use('/api',routerPasante)

// Rutas para conversaciones
app.use('/api', conversacionesRoutes);


// Rutas para google
app.use('/api/auth', routerAuth);

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

// Generar nombre único para la sala
function getRoomName(u1, u2) {
  return [u1, u2].sort().join("_");
}

// Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} se unió a la sala ${room}`);
  });

  socket.on("sendMessage", async (data) => {
    const nuevoMensaje = new Mensaje({
      remitenteId: data.remitenteId,
      destinatarioId: data.destinatarioId,
      mensaje: data.mensaje,
    });

    await nuevoMensaje.save();

    const room = getRoomName(data.remitenteId, data.destinatarioId);
    io.to(room).emit("receiveMessage", nuevoMensaje);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

//Exportar la instancia
export  { app, server, io }

