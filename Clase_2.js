

class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.libros = libros;
      this.mascotas = mascotas
    }
    getFullName(){
        return (`Nombre completo: ${this.nombre} ${this.apellido}`)
    }
    addMascota(mascota){
        this.mascotas.push(mascota)
        return (`Mascotas: ${this.mascotas}`)
    }
    countMascotas(){
        const cantidadMascotas = this.mascotas.length
        return (`Cantidad de mascotas: ${cantidadMascotas}`)
    }
    addBook(name, autor){
       this.libros.push({'name':name, 'autor':autor})
      return this.libros
    }
    getBookNames(){
     const nombreDeLibros =  this.libros.map(element => element.name);
     return nombreDeLibros;
    }
  }
  
  const usuario = new Usuario("Pedro", "Lopez", [], ["Pupi", "Roco"])
  
  console.log(usuario); 

  console.log(usuario.getFullName());
  console.log(usuario.addMascota(" Lazy"));
  console.log(usuario.countMascotas());
  console.log(usuario.addBook('El Hobbit', 'J.R.R.Tolkien'));
  console.log(usuario.addBook('El Señor De Las Moscas', 'William Golding'));
  console.log(usuario.getBookNames());


    let a =new Date()
    
console.log(a.toString());