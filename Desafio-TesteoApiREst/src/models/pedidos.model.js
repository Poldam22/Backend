import {Schema, model} from "mongoose";

const userCollections = 'pedidos';


const UserSchema = Schema(
    {
    remera:{type: String, max:100 },
    jean:{type: String},
    zapatilla:{type: String},
     }
);

 const RegistroModel = model(userCollections, UserSchema);

 export default RegistroModel;