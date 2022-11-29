const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')


const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api
const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const contenedorArchivos = new ContenedorArchivo();
const contenedorMemoria = new ContenedorMemoria()
//--------------------------------------------
// configuro el socket

io.on('connection', socket => {
    //productos
    products = contenedorArchivos.listarAll()
    socket.emit('productos', products)
    
    socket.on('producto', datat =>{
        contenedorArchivos.guardar(datat)

        io.sockets.emit('productos', products)
    })
      

    
    //mensajes
    socket.emit('mensajes', contenedorMemoria.listarAll())
    
    socket.on('message', data =>{
        contenedorMemoria.guardar(data)
       
        io.sockets.emit('mensajes', contenedorMemoria.listarAll())
    })

    
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
