import { createTransport } from "nodemailer";




export const testMail = process.env.EMAIL;

export const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})
