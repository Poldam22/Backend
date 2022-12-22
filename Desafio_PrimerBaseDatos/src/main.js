import express from 'express'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'

import config from './config.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const { Router } = express;
const productosRouter = new Router();
const mensajesRouter = new Router();

const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'products')
const mensajesApi = new ContenedorSQL(config.sqlite3, 'mensajes')

//--------------------------------------------
//Router

// Productos
productosRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    const obtenerProd = productosApi.listar(id)
    
    obtenerProd.then(a=>res.send(a))
})

productosRouter.post('/update/:id', async (req, res) => {
    const {id} = req.params
    const elem = req.body
    const actualizacion = productosApi.actualizar(elem, id) 
    actualizacion.then(a=>res.send(a))
})

productosRouter.delete('/delete/:id', async (req, res) => {
    const {id} = req.params
    const borrarProd = productosApi.borrar(id)
    borrarProd.then(a=> res.send(a))
})

//Mensajes

mensajesRouter.delete('/delete', async (req, res) => {
    const borrarMensajes = mensajesApi.borrarAll()
    borrarMensajes.then(a=> res.send(a))
})



// configuro el socket


//Implementación
io.on('connection', async socket => {

    //products
    const products = productosApi.listarAll()
    products.then(a=>socket.emit('productos', a))
    // socket.emit('productos', a)

    
    socket.on('update', datat =>{
        productosApi.guardar(datat)
        products.then(a=> io.sockets.emit('productos', a))
    })

   

    //mensajes
    const mensajes = mensajesApi.listarAll()
    mensajes.then(a=>socket.emit('mensajes', a))

    socket.on('nuevoMensaje', datat =>{
        mensajesApi.guardar(datat)
        mensajes.then(a=> io.sockets.emit('mensajes', a))
    })
    
 
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/productos', productosRouter)
app.use('/mensajes', mensajesRouter)

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
