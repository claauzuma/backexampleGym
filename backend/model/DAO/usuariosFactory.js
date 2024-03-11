import ModelMem from "./usuariosMem.js"
import ModelMongoDB from "./usuariosMongoDB.js"

class ModelFactoryUsuarios {
    static get(tipo) {
        switch (tipo) {
            case 'MEM':
                console.log('**** Persistiendo en Memoria ****')
                return new ModelMem()

            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Persistiendo en Memoria (default) ****')
                return new ModelMem()
        }
    }
}

export default ModelFactoryUsuarios