export function webAuth(req, res, next) {
    if (req.session?.nombre) {
         return next()
    } else {
        res.redirect('/main/login')
    }
}

export function apiAuth(req, res, next) {
    if (req.session?.nombre) {
        next()
    } else {
        res.status(401).json({ error: 'no autorizado!' })
    }
}