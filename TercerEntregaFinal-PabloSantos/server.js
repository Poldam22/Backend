import express  from "express";
import session from "express-session";
import expresshbs from 'express-handlebars';
import path from 'path';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import * as model from './models/usuarios.js'
import  twilio  from "twilio";
import MongoStore from "connect-mongo";
const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;


dotenv.config();

const app = express();

//MIDDLEWARE
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'));

//PASSPORT

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        //Logica para validar si un usuario existe
        
        const existeUsuario = await readMongo({email: `${username}`});
       

        if (!existeUsuario[0]) {
            return done(null, false);
            
            
        } else {
            console.log(existeUsuario[0].password);
            const match = await verifyPass(existeUsuario[0], password)

            if(!match){
                return done(null, false)
                
            }
            return done(null, existeUsuario);
           
        }
    }
));

passport.serializeUser( async(usuario, done) => {
    done(null, await usuario[0].email);
});

passport.deserializeUser(async (email, done) => {
    
    const existeUsuario = await readMongo({email: `${email}`});
    // console.log(existeUsuario);
    done(null, existeUsuario);
});



//SESIONES
app.use(session({
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}))


app.use(passport.initialize());
app.use(passport.session());

//METODOS DE AUTH CON BCRYPT
async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10)
    // console.log(password);
    return hashPassword
}

async function verifyPass(usuario, password){
    // console.log(usuario.password);
   const match = await bcrypt.compare(password, usuario.password)
//    console.log(usuario.password);
//     console.log(`pass login: ${password} || pass hash: ${usuario.password}`);
    return match
}


//MOTOR DE PLANTILLAS
app.set('views', 'src/views')
app.engine('.hbs', expresshbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    extname:'hbs'
}))
app.set('view engine', '.hbs')


function isAuth(req, res, next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/login')
    }
}


//BASE DE DATOS
// const usuariosDB = []

async function connectBase(){
    try {
        const URL = 'mongodb://localhost:27017/usuarios';

        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology:true,

        })

        console.log('Base de datos conectada!');
    } catch (error) {
        console.log(error);
    }
}

connectBase()


async function saveMongo(user){
    const userSave = new model.users(user);
    const savedUser = await userSave.save();
    // console.log(savedUser);
}

async function readMongo(user){
    const usersRead = await model.users.find(user)
    return (usersRead)
}

//NODEMAILER

const testMail = process.env.EMAIL;

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

// //TWILIO

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN

// const client= twilio(accountSid, authToken)

// const numbers = ['+5491167365807']

// try {
//     let message = ''

//     for (const number of numbers) {
//         message = await client.messages.create({
//             from:'whatsapp: +15075797364',
//             to:`whatsapp: ${number}`,
//             body:'Todo funciona bien'

//         })
//     }

// } catch (error) {
//     console.log(error);
// }




//RUTAS
app.get('/', (req, res)=>{
    res.redirect('login')
})

app.get('/login', (req, res)=>{
    res.render('login.hbs')
})

app.get('/register', (req, res)=>{
    res.render('registro.hbs')
})

app.post('/login', passport.authenticate('local', {successRedirect:'/nav', failureRedirect:'/login-error'}))

app.get('/nav', (req, res)=>{
    res.render('nav.hbs', {imagen: './remera.jps'})
})

app.post('/nav', isAuth, async (req, res)=>{
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
  


    // res.redirect('/datos')
})

app.get('/datos', async (req, res)=>{
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

app.post('/register', async (req, res)=>{
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

app.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            throw err
        }
        res.redirect('/login')
    })
})

app.get('/pedido', async (req, res)=>{


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

app.get('/login-error', (req, res)=>{
    res.render('login-error')
})


//SERVIDOR
const PORT = process.env.PORT;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error =>{
    console.error(`Error en el servidor ${error}`)
})