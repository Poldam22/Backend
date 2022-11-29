const fs = require('fs')


class Container{
    constructor(path){
        this.path = path
    }
async save(objeto){
    try {
        const leer = await fs.promises.readFile(this.path,"utf-8")
        const data = JSON.parse(leer);
        let id = 0;
        data.length == 0 ? (id=1) : (id=data[data.length-1].id + 1);
        const newProduct = {...objeto, id};
        data.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(data,null,2), "utf-8")
        return newProduct
        
    } catch (e) {
        console.log(e);
    }
}
 async getById(id){
    try {
        const leer = await fs.promises.readFile(this.path,"utf-8")
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
 async getAll(){
    try {
        const leer = await fs.promises.readFile(this.path,"utf-8")
        console.log(JSON.parse(leer));
    } catch (error) {
        console.log('no se pudo leer');
    }
        

}   
async deleteById(id){
    try {
        const leer = await fs.promises.readFile(this.path,"utf-8")
        const data = JSON.parse(leer);
        const obj = data.find(e => e.id == id);
        const index = data.indexOf(obj)
        data.splice(index,1);
        await fs.promises.writeFile(this.path, JSON.stringify(data,null,2), "utf-8")
    } catch (error) {
        
    }

}
async deleteAll() {
    try {
        await fs.promises.writeFile(this.path, JSON.stringify([],null,2), "utf-8")
    } catch (error) {
        console.log(error);
    }
}
}

const producto1={
    tittle: 'Remera',
    price: 1500,
    thumbnail: 'https://pimpumpills.com/home/producto/remera-cuphead/'
}


const producto2={
    tittle: 'buzo',
    price: 6.499,
    thumbnail: 'https://www.dexter.com.ar/buzo-nike-sportwear-hybrid/NI_CJ4435-071_M_1.html'
}


const producto3={
    tittle:'jean',
    price: 22.900,
    thumbnail: 'https://www.solodeportes.com.ar/filmore.html?nosto=productcategory-nosto-1-fallback-nosto-1'
}


// const container = new Container('./products.txt', JSON.stringify(producto1, null, 2));
const productos = new Container('data/products.doc')

// productos.getAll()
// productos.deleteAll()
// productos.save(producto2)
// productos.getById(2).then(a=>console.log(a))
productos.deleteById(5);

module.exports=Container