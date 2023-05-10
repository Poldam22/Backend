import util from "util"

export async function infoServidor(req, res){
        
        res.render('sistema.pug', { directorio: process.cwd(), idproceso: process.pid, vnode: process.version, plataforma: process.platform,
                memoria: util.inspect(process.memoryUsage(), {showHidden:false, depth:12, colors:true}), nproceso: process.title})
}