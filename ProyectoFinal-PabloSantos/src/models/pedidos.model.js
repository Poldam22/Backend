import {Schema, model} from "mongoose";

const userCollections = 'pedidos';


const UserSchema = Schema(
    {
    nombre: {type: String},
    email: {type: String},
    fecha: {type: String},
    pedido:{
    remera:{type: String},
    jean:{type: String},
    zapatilla:{type: String}
    }
     }
);

 const PedidosModel = model(userCollections, UserSchema);

 export default PedidosModel;