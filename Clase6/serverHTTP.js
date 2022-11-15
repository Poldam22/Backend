const http = require('http')

const server = http.createServer((peticion, respuesta) => {
    respuesta.end('Hola desde el back!!')
})
