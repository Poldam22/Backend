class ContenedorMemoria {
    constructor() {
        this.mensajes = [
            {email:'pedrito@gmail.com', text:'Hola!'}
        ]
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
        return this.mensajes
    }

    guardar(obj) {
        this.mensajes.push(obj)

    }

    actualizar(elem, id) {
        const posicion = this.productos.findIndex(e =>e.id == id )
        if(posicion >= 0){
        this.productos[posicion] = elem
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

    borrarAll() {
        this.productos = []
    }
}

module.exports = ContenedorMemoria
