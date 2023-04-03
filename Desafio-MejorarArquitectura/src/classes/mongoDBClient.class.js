import mongoose from "mongoose";
import Dbclient from "./DBclient.class.js";
import { config } from "../config/config.js";
import logger from "../config/loggers.js";
import CustomError from "./CustomError.class.js";


class MongoDbClient extends Dbclient{
    constructor(){
        super()
        this.connected = false;
        this.client = mongoose;
    }

    async connect(){
        try {
            await this.client.connect(config.mongodb.host, config.mongodb.options);
            this.connected = true;
            logger.info('Base de datos conectada!')
        } catch (error) {
            const objErr = new CustomError(500, 'Error al conectarse a mongodb', error)
            throw objErr;
        }
    }

    async disconnect(){
        try {
            await this.client.connection.close()
            this.connected = false;
            logger.info('Base de datos desconectada!')
        } catch (error) {
            const objErr = new CustomError(500, 'Error al conectarse a mongodb', error)
            throw objErr;
        }
    }

}

export default MongoDbClient;

