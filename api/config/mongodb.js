const debug = require('debug')('app:mongoose');
const mongoose= require('mongoose');

const dbhost = process.env.DBHOST || 'localhost'
const dbport = process.env.DBHOST || '27017'
const dbname = process.env.DBNAME || 'PillOclockDB'

const dburi= process.env.DBURI || `mongodb://${dbhost}:${dbport}/${dbname}`

const connect= async() => {
    try {
        await mongoose.connect(dburi, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        debug('Conexion exitosa con la base')
    } catch(error) {
        console.log(error)
        debug('no se pudo conectar a la base')
        process.exit(1)
    }
}

module.exports = {
    connect
}