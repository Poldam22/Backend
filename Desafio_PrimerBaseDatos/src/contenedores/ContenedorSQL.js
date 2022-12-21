import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async listar(id) {
        
    }

    async listarAll() {
        
    }

    async guardar(elem) {
        await this.knex(this.tabla).insert(elem)
    }

    async actualizar(elem, id) {
        
    }



    async borrar(id) {
        
    }

    async borrarAll() {
        
    }

    async desconectar() {
    
    }
}

export default ContenedorSQL