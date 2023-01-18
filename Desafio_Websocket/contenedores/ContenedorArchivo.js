
class ContenedorArchivo {

    constructor() {
        this.productos = [
            {
                title: 'Mochila',
                price: 1500,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            {
                title: 'Lapiz',
                price: 200,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            {
                title: 'Lapicera',
                price: 300,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            {
                title: 'Fibras',
                price: 500,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            {
                title: 'Cartuchera',
                price: 700,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            {
                title: 'Juguete',
                price: 4000,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-64.png'
            },
            
            
            {
                title: 'Calculadora',
                price: 700,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-64.png'
            }
            ]
        this.id = 0
    }

    listar(id) {
        const posicion = this.productos.findIndex(e =>e.id == id )
        if(posicion == -1){
            return ({error: 'producto no encontrado'})
        }else{
            return (this.productos[posicion]) 
        }
    }

    listarAll() {
        return this.productos
    }

    guardar(prod) {
        let products = this.productos
        let id = 0
        this.productos.length == 0 ? (id=1) : (id=products[products.length-1].id + 1);
        const nuevoProducto = {...prod, id}
        this.productos.push(nuevoProducto)
        return('producto guardado')
    }

    actualizar(prod, id) {
        const posicion = this.productos.findIndex(e =>e.id == id )
        if(posicion >= 0){
        this.productos[posicion] = prod
        return('producto actualizado')
        }else{
            return({error:'producto no encontrado'})
        }
    }

    borrar(id) {
        const posicion = this.productos.findIndex(e =>e.id == id )
        if(posicion == -1){
            return({error: 'producto no encontrado'})
        }else{

          const productoEliminado = this.productos.splice(posicion, 1)
          return({producto:productoEliminado})
        }
    }
}





 module.exports = ContenedorArchivo