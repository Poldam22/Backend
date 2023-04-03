import CustomError from "./CustomError.class.js";

class Dbclient{
    async connect(){
        throw new CustomError(500, 'Falta implementar', 'method connect en sub clase')
    }

    async disconnect(){
        throw new CustomError(500, 'Falta implementar', 'method disconnect en sub clase')
    }
}

export default Dbclient;