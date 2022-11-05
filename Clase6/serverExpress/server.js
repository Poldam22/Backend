const express = require('express')
const fs = require('fs');


const app = express()
const PORT = 8080

let visitas = 0;

class Container{
    constructor(path){
        this.path = path
    }
    async getAll(){
        try {
            const leer = await fs.promises.readFile(this.path,"utf-8")
            return leer
           
        } catch (error) {
            console.log('no se pudo leer');
        }
    }   
  async  getById(){
        
        try {
            let id = Math.floor(Math.random() * (4 - 1) + 1)
            const leer = await fs.promises.readFile(this.path,"utf-8")
            const data = JSON.parse(leer);
            const obj = data.find(e => e.id == id);

            return obj
        } catch (error) {
            console.log(error);
        }
    }
}


const productos = new Container('./products.txt')



app.get('/',(req, res)=>{
    products = productos.getAll()
    products.then(a=> res.send(a))
})



 app.get('/productRandom',(req, res)=>{
   let productram = productos.getById()
  productram.then(a=>res.send(a))
 })


const server = app.listen(PORT, ()=>{
    console.log(`servidor express escuchando en el pto: ${PORT}`);
})

server.on('error', error => {console.log(`Error en servidor ${error}`)})


