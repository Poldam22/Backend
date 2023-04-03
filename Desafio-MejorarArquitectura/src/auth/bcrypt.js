import bcrypt from 'bcrypt'

//METODOS DE AUTH CON BCRYPT
export async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10)
    // console.log(password);
    return hashPassword
}

export async function verifyPass(usuario, password){
   
   const match = await bcrypt.compare(password, usuario.password)

    return match
}