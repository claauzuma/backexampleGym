import express from 'express'
import RouterUsuarios from './router/usuarios.js'
import RouterRutinas from './router/rutinas.js'
import RouterClases from './router/clases.js'
import CnxMongoDB from './model/DBMongo.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

class Server {
  constructor(port, persistencia) {
    this.port = port
    this.persistencia = persistencia
    this.app = express()
    this.server = null
  }

  async start() {


    this.app.use(express.json())
    this.app.use(cookieParser())


    this.app.use((req,res,next)=> {
      const token = req.cookies.access_token
      let data = null
      req.session = {user : null}
      try {
        data = jwt.verify(token, "CLAVE_SECRETA")
        req.session.user = data;
      }
      catch {}
      next()

    })
    

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      // Agrega esta condición para manejar el preflight request de CORS
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
    

    this.app.use(express.static('public'));


    

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




