import ContenedorMongoDb from "../containers/contenedorMongoDb.js";
import PedidosModel from "../pedidos.model.js";

class pedidosDAO extends ContenedorMongoDb {
    constructor(){
        super(PedidosModel);
    }
}

export default pedidosDAO;