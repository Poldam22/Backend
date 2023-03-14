import express  from "express";
import session from "express-session";
import expresshbs from 'express-handlebars';
import path from 'path';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
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

//PASSPORT

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        //Logica para validar si un usuario existe
        const existeUsuario = await usuariosDB.find(usuario => usuario.email == username);

        // console.log(existeUsuario);

        if (!existeUsuario) {
            return done(null, false);
        } else {

            const match = await verifyPass(existeUsuario, password)

            if(!match){
                return done(null, false)
            }
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.email);
});

passport.deserializeUser((email, done) => {
    const existeUsuario = usuariosDB.find(usuario => usuario.email == email);
    done(null, existeUsuario);
});



//SESIONES
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb://localhost/usuarios"
    }),
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:20000 //20seg
    }
}))


app.use(passport.initialize());
app.use(passport.session());

//METODOS DE AUTH CON BCRYPT
async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(usuario, password){
   const match = await bcrypt.compare(password, usuario.password)
    console.log(`pass login: ${password} || pass hash: ${usuario.password}`);
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
const usuariosDB = []

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

app.post('/login', passport.authenticate('local', {successRedirect:'/datos', failureRedirect:'/login-error'}))


app.get('/datos', isAuth ,(req, res)=>{
    if(!req.user.contador){
        req.user.contador = 1
    }else{
        req.user.contador++
    }

    const datosUsuario = {
        email: req.user.email,
        direccion: req.user.direccion,
        nombre: req.user.nombre,
        edad: req.user.edad,
        numerocel: req.user.numerocel

    }
    res.render('datos', {contador: req.user.contador, datos: datosUsuario})
})

app.post('/register', async (req, res)=>{
    const {email, password, direccion, nombre, edad, numerocel} = req.body;

    const newUsuario = usuariosDB.find(usuario => usuario.email == email);
    if(newUsuario){
        res.render('register-error')
    }else{
        const newUser = {email, password: await generateHashPassword(password), direccion, nombre, edad, numerocel}
        
        
        usuariosDB.push(newUser);
        console.log(usuariosDB);
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