import { Router } from 'express';
import passport from 'passport';
// import { generateHashPassword }from '../../server.js'
import { generateHashPassword } from '../auth/bcrypt.js';
import { testMail, transporter } from '../envios/nodemailer.js';
import { saveMongo, readMongo } from '../services/mongo.js';


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

router.get('/nav', (req, res)=>{
    res.render('nav.hbs', {imagen: './remera.jps'})
})

router.post('/nav', isAuth, async (req, res)=>{
    const {remera, jean, zapatilla} = req.body

    req.session.pedido = {
        remera: remera,
        jean: jean,
        zapatilla: zapatilla
    }

    if(!req.session.contador){
        req.session.contador = 1
     
    }else{
        req.session.contador++
       
    }
    
    const datosUsuario = {
        email: req.user[0].email,
        direccion: req.user[0].direccion,
        nombre:  req.user[0].nombre,
        edad:  req.user[0].edad,
        numerocel: req.user[0].numerocel

    }
    res.render('datos', {contador: req.session.contador, datos: datosUsuario, pedido: req.session.pedido})
  
})

router.get('/datos', async (req, res)=>{
    if(!req.session.contador){
        req.session.contador = 1
     
    }else{
        req.session.contador++
       
    }
    
    const datosUsuario = {
        email: req.user[0].email,
        direccion: req.user[0].direccion,
        nombre:  req.user[0].nombre,
        edad:  req.user[0].edad,
        numerocel: req.user[0].numerocel

    }
    res.render('datos', {contador: req.session.contador, datos: datosUsuario})
  
   
    
})

router.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            throw err
        }
        res.redirect('/login')
    })
})

router.get('/login-error', (req, res)=>{
    res.render('login-error')
})


router.post('/register', async (req, res)=>{
    const {email, password, direccion, nombre, edad, numerocel} = req.body;

    // const newUsuario = usuariosDB.find(usuario => usuario.email == email);
     const newUsuario =  await readMongo({email: `${email}`});
    
    if(newUsuario == []){
        res.render('registro-error.hbs')
    }else{
        const newUser = {email, password: await generateHashPassword(password), direccion, nombre, edad, numerocel}
       
       
        const mailOptions = {
            from: 'Servidor Node.JS',
            to: testMail,
            subject: 'Nuevo Registro',
            html: `<h1>Nuevo Registro</h1><br><p><span>Nombre:</span> ${nombre}</p><br><p><span>Email:</span> ${email}</p><br><p><span>Edad: </span>${edad}</p>
            <br><p><span>Dirección: </span>${direccion}</p><br><p><span>Numero de telefono: </span>${numerocel}</p>`
        }
        
        try {
            const info = await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }

        saveMongo(newUser)
        res.redirect('/login')
    }
})

router.get('/pedido', async (req, res)=>{


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

    console.log(req.session.pedido);

    req.session.destroy(err=>{
        if(err){
            throw err
        }
        res.redirect('/login')
    })
})


export default router