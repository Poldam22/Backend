import mongoose from "mongoose";
import * as model from '../models/usuarios.js'


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


export async function saveMongo(user){
    const userSave = new model.users(user);
    const savedUser = await userSave.save();
    // console.log(savedUser);
}

export async function readMongo(user){
    const usersRead = await model.users.find(user)
    return (usersRead)
}
