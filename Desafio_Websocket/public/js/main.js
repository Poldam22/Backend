const socket = io.connect();

//------------------------------------------------------------------------------------
const nombre = document.getElementById('nombre')
const precio = document.getElementById('precio')
const foto = document.getElementById('foto')




const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update
    const producto = {
        title: nombre.value,
        price: precio.value,
        thumbnail: foto.value
    }

    socket.emit('producto', producto)

    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('productos', productos =>{makeHtmlTable(productos)})


function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({productos} )
            document.getElementById('productos').innerHTML = html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')



const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
   
    const message = {
        email: inputUsername.value,
        text: inputMensaje.value
    }

    socket.emit('message', message)

    formPublicarMensaje.reset()
    inputMensaje.focus()
})




socket.on('mensajes', mensajes => {
    
    makeHtmlList(mensajes)
})

function makeHtmlList(mensajes) {
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
    const html = mensajes.map(item =>{
        return (`<div> <strong>${item.email}:  </strong><em>${item.text}</em></div>`)
    }).join(' ')

    document.getElementById('mensajes').innerHTML = html;
}


inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value
    const hayTexto = inputMensaje.value
    inputMensaje.disabled = !hayEmail.length
    btnEnviar.disabled = !hayEmail.length || !hayTexto.length
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value
    btnEnviar.disabled = !hayTexto.length
})