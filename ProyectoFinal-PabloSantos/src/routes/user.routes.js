import { Router } from 'express';
import passport from 'passport';
import { logout, obtenerDatos, registro, vistaPedido } from '../controllers/registro.Controllers.js';
import { eliminarPedido, pedidoFinalizado, listaPedidos } from '../controllers/pedido.Controlller.js';
import { infoServidor } from '../controllers/servidorInfo.js';




const router = new Router()


function isAuth(req, res, next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/login')
    }
}






router.get('/', (req, res)=>{
    res.redirect('login')
})

router.get('/login', (req, res)=>{
    res.render('login.hbs')
})

router.get('/register', (req, res)=>{
    res.render('registro.hbs')
})

router.post('/login', passport.authenticate('local', {successRedirect:'/nav', failureRedirect:'/login-error'}))

router.get('/nav', (req, res)=>{ res.render('nav.hbs')})

router.post('/nav', isAuth, vistaPedido)

router.get('/datos', obtenerDatos)

router.get('/verpedidos', isAuth, listaPedidos)

router.get('/servidor', isAuth, infoServidor)

router.get('/chat', (req, res)=>{res.render('chat.hbs')})

router.get('/logout', logout)

router.get('/login-error', (req, res)=>{
    res.render('login-error')
})

router.delete('/pedidosElim', isAuth, eliminarPedido)

router.post('/register', registro)

router.get('/pedido', pedidoFinalizado)


export default router