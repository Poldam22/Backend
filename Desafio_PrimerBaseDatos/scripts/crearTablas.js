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
try {
    const sqliteClient = knex(config.sqlite3)

    //Implementar creación de tabla

    console.log('tabla mensajes en sqlite3 creada con éxito')
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
}