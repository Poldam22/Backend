import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import util from 'util'
import { fork } from 'child_process'
import os from 'os';

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'
import cluster from 'cluster'


//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

//--------------------------------------------
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
app.get('/api/randoms', async(req, res)=>{
    const {num = 100_000_00} = req.query;
    const result = await calculate(num);
    res.json(result);
    res.send('hola')
})

//ruta info
const cpu_cores = os.cpus().length;

app.get('/main/info', (req,res)=>{
//    let aa ={ Directorio: process.cwd(), Idproceso: process.pid, Vnode: process.version, Plataforma: process.platform,
//      Memoria: util.inspect(process.memoryUsage(), {showHidden:false, depth:12, colors:true}), Nproceso:process.title}
//    res.json(aa)

res.render('../views/pages/info.ejs', { Directorio: process.cwd(), Idproceso: process.pid, Vnode: process.version, Plataforma: process.platform,
      Memoria: util.inspect(process.memoryUsage(), {showHidden:false, depth:12, colors:true}), Cpu: cpu_cores})

})

app.get('/main/lala', (req, res)=>{
    res.send(`PID: ${process.pid}`)
})

//--------------------------------------------
// inicio el servidor

if(process.argv[2] == 'cluster'){

    if(cluster.isPrimary){
         for(let i = 0; i < cpu_cores; i++){
        cluster.fork()
    }
    }else{
         app.listen(config.PORT, ()=>{
        console.log(`Servidor escuchando en el puerto ${config.PORT}`);
    }) 
    }

   

   

}else{

    
    // const connectedServer = httpServer.listen(config.PORT, () => {
    //     console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
    // })
    // connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

    app.listen(config.PORT, ()=>{
        console.log(`Servidor escuchando en el puerto ${config.PORT}`);
    })
}
