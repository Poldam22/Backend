import knex from 'knex'
import config from '../src/config.js'

//------------------------------------------
// productos en MariaDb

const mariaDbClient = knex(config.mariaDb);



(async () =>{

    try {
        
        //Implementar creación de tabla
        console.log('borrar si existe tablae');
        await mariaDbClient.schema.dropTableIfExists('products')


        
        console.log('tabla productos en mariaDb creada con éxito')
        await mariaDbClient.schema.createTable('products', table => {
            table.increments('id').primary();
            table.string('title');
            table.float('price');
            table.string('thumbnail')
        })
    } catch (error) {
        console.log('error al crear tabla productos en mariaDb')
        console.log(error)
    }finally{
        mariaDbClient.destroy()
    }
}
)()


//------------------------------------------
// mensajes en SQLite3
(async() =>{

    const sqliteClient = knex(config.sqlite3)
try {
   
    await sqliteClient.schema.createTable('mensajes', table => {
        table.string('email');
        table.string('text');
        table.date('fyh')
    })
} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
}finally{
    sqliteClient.destroy()
}

})()