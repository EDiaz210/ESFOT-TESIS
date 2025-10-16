import mongoose, { Schema, model } from 'mongoose';

const mensajeSchema = new Schema({
  numbers: { 
    type: [String],
    required: true // número
    }, 
  message: { 
    type: String,
    default: '' 
    },
  hasMedia: { 
    type: Boolean, 
    default: false 
    },
  files: [
    {
      fileName: { type: String },
      mimeType: { type: String },
    },
  ],
  date: { 
    type: Date, 
    default: Date.now }, 
  tipo: {
    type: String,
    enum: ['Administrativas', 'Académicas', 'Extracurriculares'],
    required: true
  }
});

export default model('Mensaje', mensajeSchema);
