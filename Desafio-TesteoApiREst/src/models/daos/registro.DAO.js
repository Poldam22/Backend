import ContenedorMongoDb from "../containers/contenedorMongoDb.js";
import RegistroModel from "../usuarios.js";

class registroDAO extends ContenedorMongoDb {
    constructor(){
        super(RegistroModel);
    }
}

export default registroDAO;