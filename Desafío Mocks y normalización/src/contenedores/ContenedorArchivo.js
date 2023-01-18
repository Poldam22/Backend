// import { promises as fs } from 'fs'
import fs from 'fs';

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        try {
            const leer = await fs.promises.readFile(this.ruta,"utf-8")
            const data = JSON.parse(leer);
            const obj = data.find(e => e.id == id);
            if (!obj){
                return null
            } 
            return obj
            
        } catch (error) {
            console.log(error);
        }
    }

    async listarAll() {
        try {
            const leer = await fs.promises.readFile(this.ruta,"utf-8")
            return JSON.parse(leer)
        } catch (error) {
            console.log('no se pudo leer');
        }
    }

    async guardar(obj) {
        try {
            const leer = await fs.promises.readFile(this.ruta,"utf-8")
            const data = JSON.parse(leer);
            let id = 0;
            data.length == 0 ? (id=1) : (id=data[data.length-1].id + 1);
            const newProduct = {...obj, id};
            data.push(newProduct);
            await fs.promises.writeFile(this.ruta, JSON.stringify(data,null,2), "utf-8")
            return ('Producto guardado')
            
        } catch (e) {
            console.log(e);
        }
    }

    async actualizar(id, elem) {
        const leer = await fs.promises.readFile(this.ruta,"utf-8")
        const data = JSON.parse(leer);
        const posicion = data.findIndex(e =>e.id == id )
            if(posicion > 0){
                data[posicion] = {...elem, id}
                await fs.promises.writeFile(this.ruta, JSON.stringify(data,null,2), "utf-8")
                return ('Producto actualizado')
            }else{
                return ({error:'producto no encontrado'})
            }
    }

    async borrar(id) {
        try {
            const leer = await fs.promises.readFile(this.ruta,"utf-8")
            const data = JSON.parse(leer);
            const obj = data.find(e => e.id == id);
            const index = data.indexOf(obj)
            data.splice(index,1);
            await fs.promises.writeFile(this.ruta, JSON.stringify(data,null,2), "utf-8")
            return ("Producto borrado")
        } catch (error) {
            console.log(error);
        }
    }

    async borrarAll() {
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify([],null,2), "utf-8")
        } catch (error) {
            console.log(error);
        }
    }
}


export default ContenedorArchivo