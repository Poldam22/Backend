const messages = []



export async function chatControl(socket, sockets ){
    socket.emit('messages', messages)

    //escuchamos al cliente
    socket.on('new-message', data =>{
        messages.push(data)
   

    //re enviamos por medio de broadcast los msn a todos los clientes que esten conectador en ese momento

    sockets.emit('messages', messages)
})
}