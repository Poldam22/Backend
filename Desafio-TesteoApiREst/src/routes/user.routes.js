import { Router } from 'express';
import passport from 'passport';
import { logout, obtenerDatos, pedidoFinalizado, registro, vistaPedido } from '../controllers/registro.Controllers.js';




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

router.get('/nav', (req, res)=>{ res.render('nav.hbs', {imagen: './remera.jps'})})

router.post('/nav', isAuth, vistaPedido)

router.get('/datos', obtenerDatos)

router.get('/logout', logout)

router.get('/login-error', (req, res)=>{
    res.render('login-error')
})


router.post('/register', registro)

router.get('/pedido', pedidoFinalizado)


export default router