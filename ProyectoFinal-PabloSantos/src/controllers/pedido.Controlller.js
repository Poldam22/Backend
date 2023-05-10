import { transporter, testMail } from "../envios/nodemailer.js"
import pedidosDAO from "../models/daos/pedidos.DAO.js";


const DAOpedidos = new pedidosDAO()





export async function pedidoFinalizado(req, res) {


    const mailOptions = {
        from: 'Servidor Node.JS',
        to: testMail,
        subject: 'Nuevo Pedido',
        html: `<h1>Nuevo Pedido</h1><br><p><span>Nombre:</span> ${req.user[0].nombre}</p><br><p><span>Email:</span> ${req.user[0].email}</p><br><p><span>Pedido: </span><br>${req.session.pedido.remera};<br>
        ${req.session.pedido.jean},  <br>${req.session.pedido.zapatilla}</p>`
    }
    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }

    // console.log(req.session.pedido);
    const newPedido = { nombre: req.user[0].nombre, email: req.user[0].email, fecha: new Date().toLocaleString(), pedido: req.session.pedido }


    DAOpedidos.saveMongo(newPedido)


    req.session.destroy(err => {
        if (err) {
            throw err
        }
        res.redirect('/login')
    })
}


export async function listaPedidos(req, res){
    const all = await DAOpedidos.readMongo()
    res.send(all)
}

export async function eliminarPedido(req, res){
    const eliminado = await DAOpedidos.deleteMongo()
    res.send(eliminado)
}