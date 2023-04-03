// import twilio from 'twilio'

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
