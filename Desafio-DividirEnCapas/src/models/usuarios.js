import mongoose from "mongoose";

const userCollections = 'sessions';


const userSchema = new mongoose.Schema(
    {
    nombre:{type: String, require: true, max:100 },
    email:{type: String, require: true, max:100 },
    direccion:{type: String, require: true, max:100 },
    edad:{type: Number, require: true, max:100 },
    numerocel:{type: Number, require: true},
    password:{type: String, require: true},
    

    
    }
)

export const users = mongoose.model(userCollections, userSchema);