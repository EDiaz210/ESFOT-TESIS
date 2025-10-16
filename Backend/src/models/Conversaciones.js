import {Schema,model} from 'mongoose'

const ConversacionSchema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId, required: true
    },
  usuarioTipo: {
    type: String, required: true, enum: ["administrador", "estudiante"] 
    },
  pregunta: String,
  respuesta: String,
  contexto: [{ 
    url: String, relevancia: Number 
    }],
  fecha: { 
    type: Date, default: Date.now 
    },
});

ConversacionSchema.virtual("usuario", {
  refPath: "usuarioTipo",
  localField: "usuarioId",
  foreignField: "_id",
  justOne: true,
});

export default model("Conversacion", ConversacionSchema);
