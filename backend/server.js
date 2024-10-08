import express from 'express'
import RouterUsuarios from './router/usuarios.js'
import RouterRutinas from './router/rutinas.js'
import RouterClases from './router/clases.js'
import CnxMongoDB from './model/DBMongo.js'
import cors from 'cors'

class Server {
  constructor(port, persistencia) {
    this.port = port
    this.persistencia = persistencia
    this.app = express()
    this.server = null
  }

  async start() {


    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors({
      origin: (origin,callback) => {
        const ACCEPTED_ORIGINS = [
          'http://localhost:5173'
        ]

        if(ACCEPTED_ORIGINS.includes(origin)) {
          return callback(null,true)
        }
      if(!origin) {
        return callback(null,true)
      }

      return callback(new Error('Not allowed by '))

      }
    }

    ))


    this.app.use(express.static('public'))


    

    // Rutas de la API
    this.app.get('/', (req,res) => {
      res.json({message: "Hola mundo "})
    })

    this.app.use('/api/usuarios', new RouterUsuarios(this.persistencia).start())
    this.app.use('/api/rutinas', new RouterRutinas(this.persistencia).start())
    this.app.use('/api/clases', new RouterClases(this.persistencia).start())

    // Conexión a MongoDB si se selecciona MONGODB como persistencia
    if (this.persistencia === 'MONGODB') {
      await CnxMongoDB.conectar()
    }

    // Inicia el servidor
    const PORT = this.port
    this.server = this.app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`))
    this.server.on('error', error => console.log(`Error en servidor: ${error.message}`))

 

    return this.app
  }

  async stop() {
    if (this.server) {
      this.server.close()
      await CnxMongoDB.desconectar()
      this.server = null
    }
  }
}

export default Server;




