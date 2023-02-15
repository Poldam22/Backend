import { Router } from 'express'

import path from 'path'

const authWebRouter = new Router()

authWebRouter.get('/main', (req, res) => {
    res.redirect('/main/home')
})

authWebRouter.get('/main/login', (req, res) => {
    const nombre = req.session?.nombre
    if (nombre) {
        res.redirect('/main')
    } else {
        res.sendFile(path.join(process.cwd(), '/views/login.html'))
    }
})

authWebRouter.get('/main/logout', (req, res) => {
    const nombre = req.session?.nombre
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render(path.join(process.cwd(), '/views/pages/logout.ejs'), { nombre })
            } else {
                res.redirect('/main')
            }
        })
    } else {
        res.redirect('/main')
    }
})


authWebRouter.post('/main/login', (req, res) => {

    req.session.nombre = req.body.nombre
    
    res.redirect('/main/home')
})



export default authWebRouter