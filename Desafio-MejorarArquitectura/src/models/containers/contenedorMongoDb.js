import CustomError from "../../classes/CustomError.class.js";
import MongoDbClient from "../../classes/mongoDBClient.class.js";
import logger from "../../config/loggers.js";

class ContenedorMongoDb{
    constructor(modelo){
        this.coleccion = modelo
        this.conn = new MongoDbClient();
    }

    async saveMongo(user){
        try {
            this.conn.connect();
            const userSave = new this.coleccion(user);
            const savedUser = await userSave.save();
            // console.log(savedUser);
            
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al guardar', error)
            logger.error(cuserr);
            throw cuserr;
        } 
        // finally{
        //     this.conn.disconnect();
        // }
            
     
       
    }
    
    async readMongo(user){
    try {
        this.conn.connect()
        const usersRead = await this.coleccion.find(user)
        // console.log(usersRead);
        return (usersRead)
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al leer data', error)
            logger.error(cuserr);
            throw cuserr;
    }
    // finally{
    //     this.conn.disconnect();
    // }

         
      
        
    }
    

}

export default ContenedorMongoDb;



