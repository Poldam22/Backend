import express from 'express'
import faker from 'faker'
import { normalize, schema, denormalize } from 'normalizr'
import util from 'util'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

import config from './config.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'products')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES



// Definimos un esquema de autor
const authorSchema = new schema.Entity('author', {idAttribute:'email'})

// Definimos un esquema de mensaje
const msjSchema = new schema.Entity('mensajes')

// Definimos un esquema de posts

const postSchema = new schema.Entity('posts', {
    author: authorSchema,
    mensajes: msjSchema
})

let mensaje1 = mensajesApi.listarAll() 
mensaje1.then(a=>listarMensajesNormalizados(normalize(a, postSchema)))







//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    const products = productosApi.listarAll()
    products.then(a=>socket.emit('productos', a))

    // actualizacion de productos
    socket.on('update', datat =>{
        productosApi.guardar(datat)
        products.then(a=> io.sockets.emit('productos', a))
    })

    // carga inicial de mensajes
    
let mensaje1 = mensajesApi.listarAll() 
mensaje1.then(a=>socket.emit('mensajes', normalize(a, postSchema)))
    // const mensajes = mensajesApi.listarAll()
    // mensajes.then(a=>socket.emit('mensajes', a))

    // actualizacion de mensajes
    socket.on('nuevoMensaje', datat =>{
        mensajesApi.guardar(datat)
        mensajes.then(a=> io.sockets.emit('mensajes', a))
    })
    
});

async function listarMensajesNormalizados(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
function datosFaker() {
    return{
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}



app.get('/api/productos-test', (req, res) => {
    const objs = [];

    for(let i = 0; i < 5; i++){
        objs.push(datosFaker())
    }

    res.json(objs)
})

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
