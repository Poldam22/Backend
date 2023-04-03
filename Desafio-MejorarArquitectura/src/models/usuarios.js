import {Schema, model} from "mongoose";

const userCollections = 'sessions';


const UserSchema = Schema(
    {
    nombre:{type: String, require: true, max:100 },
    email:{type: String, require: true, max:100 },
    direccion:{type: String, require: true, max:100 },
    edad:{type: Number, require: true, max:100 },
    numerocel:{type: Number, require: true},
    password:{type: String, require: true},
    

     }
);

 const RegistroModel = model(userCollections, UserSchema);

 export default RegistroModel;