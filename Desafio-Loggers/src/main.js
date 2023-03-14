import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import util from 'util'
import { fork } from 'child_process'
import compression from 'compression'
import Log4js from 'log4js'

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'


//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

//--------------------------------------------

//Compression
app.use(compression())


//Configuración log4js
const log4js = Log4js;

log4js.configure({
    appenders:{

        myLoggerConsole:{type: 'console'},
        myLoggerFile: {type:'file', filename:'warn.log'},
        myLoggerFile2: {type:'file', filename:'error.log'}
    },
    categories:{
        default:{appenders:['myLoggerConsole'], level: 'info'},
        console:{appenders:['myLoggerConsole', 'myLoggerFile'], level:'warn'},
        archivo:{appenders:['myLoggerConsole', 'myLoggerFile2'], level:'error'}

    }

})

// const logger = log4js.getLogger('archivo')

// logger.trace('Logger trace');
// logger.debug('Logger debug');
// logger.info('Logger info');
// logger.warn('Logger warn');
// logger.error('Logger error');
// logger.fatal('Logger fatal');


// configuro el socket

io.on('connection', async socket => {
    // console.log('Nuevo cliente conectado!');
    addProductosHandlers(socket, io.sockets)
    addMensajesHandlers(socket, io.sockets)
});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs');

app.use(session({
    store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    // store: MongoStore.create({ mongoUrl: config.mongoRemote.cnxStr }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

//--------------------------------------------
// rutas del servidor API REST

app.use(productosApiRouter)

//--------------------------------------------
// rutas del servidor web

app.use(authWebRouter)
app.use(homeWebRouter)



function calculate(num) {
    return new Promise((res, rej)=>{
        const forkedProcess = fork('./src/calculoNumeros.js');
        forkedProcess.on('message', (msg)=>{
            if(msg='ready'){
                forkedProcess.send(num);
            }else{
                res(msg);
            }
        })
    })
}

//ruta numeros random
app.get('/randoms', async(req, res)=>{
    const {num = 100_000_00} = req.query;
    const result = await calculate(num);
    res.json(result);
    res.send('hola')
})

//ruta info
app.get('/info', (req,res)=>{

res.render('../views/pages/info.ejs', { Directorio: process.cwd(), Idproceso: process.pid, Vnode: process.version, Plataforma: process.platform,
      Memoria: util.inspect(process.memoryUsage(), {showHidden:false, depth:12, colors:true}), Nproceso:process.title})

})


//--------------------------------------------
// inicio el servidor

const connectedServer = httpServer.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
