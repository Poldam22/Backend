import dotenv from 'dotenv';
dotenv.config();
import minimist from 'minimist';

let options = {default:{p:8080}}
let args= minimist(process.argv.slice(2), options)


export default {
    PORT: args.p,
    mongoLocal: {
        client: process.env.MongoL_client,
        cnxStr: process.env.MongoL_cnxStr,
    },
    mongoRemote: {
        client: process.env.MongoR_client,
        cnxStr: process.env.MongoR_cnxStr,
    },
    sqlite3: {
        client: process.env.sqlite_client,
        connection: {
            filename: process.env.sqlite_filename,
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: process.env.mariaDb_client,
        connection: {
            host: process.env.mariaDb_host,
            user: process.env.mariaDb_user,
            password: process.env.mariaDb_password,
            database: process.env.mariaDb_database
        }
    },
    fileSystem: {
        path: process.env.fileSystem_path
    }
}
