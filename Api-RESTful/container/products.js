class ProductosApi {
    constructor() {
        this.productos = [
            {
                tittle: 'remera',
                price: '1500',
                thumbnail: './productos/remera',
                id: 1
            },
            {
                tittle: 'jean',
                price:'3000',
                thumbnail:'/productos/jean',
                id: 2
            }
        ]
    }

    listar(req, res) {
        const {id} = req.params
        const posicion = this.productos.findIndex(e =>e.id == id )

        if(posicion == -1){
            res.send({error: 'producto no encontrado'})
        }else{

            res.send(this.productos[posicion]) 
        }
       
    }

    listarAll() {
        return this.productos
    }

    guardar(req, res){
        let products = this.productos
        let id = 0
        const producto = req.body
        console.log(req.body);
        this.productos.length == 0 ? (id=1) : (id=products[products.length-1].id + 1);
        const nuevoProducto = {...producto, id}
        this.productos.push(nuevoProducto)
        res.send('producto guardado')
    }

    actualizar(req, res) {
        const palabra = req.body
        const {id} = req.params
        const posicion = this.productos.findIndex(e =>e.id == id )

        if(posicion.length){
        this.productos[posicion] = palabra
        res.send('producto actualizado')
        }else{
            res.send({error:'producto no encontrado'})
        }

        }

    borrar(req, res) {
        const {id} = req.params
        const posicion = this.productos.findIndex(e =>e.id == id )
        if(posicion == -1){
            res.send({error: 'producto no encontrado'})
        }else{

          const productoEliminado = this.productos.splice(posicion, 1)
          res.send({producto:productoEliminado})
        }
    }
}

export default ProductosApi
