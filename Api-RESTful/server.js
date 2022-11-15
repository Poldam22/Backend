import express from 'express';
import { Router } from 'express';
import ProductosApi from './container/products.js'

// router de productos
const app = express()
const productosApi = new ProductosApi()

const productosRouter = Router()

productosRouter.use(express.json())
productosRouter.use(express.urlencoded({ extended: true }))

//rutas usando productosRouter

productosRouter.get('/', (req, res)=>{
    res.json({productos: productosApi.listarAll()})
})

productosRouter.get('/:id', (req, res) => {
    productosApi.listar(req, res)
})

productosRouter.post('/', (req, res)=>{
    productosApi.guardar(req, res)
})

productosRouter.put('/:id', (req, res)=>{
    productosApi.actualizar(req, res)
})

productosRouter.delete('/:id', (req, res)=>{
    productosApi.borrar(req, res)
})


// servidor

// const app = express()
app.use(express.static('public'))
app.use('/api/productos', productosRouter)

const PORT = 8060
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))