import bcrypt from "bcryptjs"
import mongoose, {Schema,model} from 'mongoose'

const pasanteSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:false,
        trim:true
    },
    username:{
        type: String,
        required:false,
        trim:true
    },
        
    email:{
        type: String,    
        unique:true,
        trim: true
    },
    
    password:{
        type:String,
        required: true,
        trim: true
    },
    
    avatarUsuario:{
        type:String,
        trim:true
    },

    avatarUsuarioID:{
        type:String,
        trim:true
    },
        
    token:{
        type:String,
        default:null
    },

    rol:{
        type:String,
        default:"pasante"
    },
    
    status:{
        type:Boolean,
        default:true
    },
        
    confirmEmail:{
        type:Boolean,
        default:false
    },

    administrador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Administrador'

  }},{
    timestamps:true
})


// Método para cifrar el password
pasanteSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}


// Método para verificar si el password es el mismo de la BDD
pasanteSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.password)
}


export default model('Pasante',pasanteSchema)