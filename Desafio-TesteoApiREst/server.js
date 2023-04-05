import express  from "express";
import session from "express-session";
import expresshbs from 'express-handlebars';
import path from 'path';
import dotenv from 'dotenv'
// import { readMongo } from "./src/services/mongo.js";
import { verifyPass } from "./src/auth/bcrypt.js";
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
import router from './src/routes/user.routes.js'
import registroDAO from "./src/models/daos/registro.DAO.js";
import { connectBase } from "./src/services/mongo.js";



dotenv.config();

export const app = express();

const DAO = new registroDAO();


//MIDDLEWARE
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'));

//PASSPORT

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        //Logica para validar si un usuario existe
        
        const existeUsuario = await DAO.readMongo({email: `${username}`});
        console.log(existeUsuario);
       

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
    
    const existeUsuario = await DAO.readMongo({email: `${email}`});
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




//MOTOR DE PLANTILLAS
app.set('views', 'src/views')
app.engine('.hbs', expresshbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    extname:'hbs'
}))
app.set('view engine', '.hbs')


//RUTAS


app.use(router)

// connectBase()

//SERVIDOR
const PORT = process.env.PORT;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error =>{
    console.error(`Error en el servidor ${error}`)
})