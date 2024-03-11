import { ObjectId } from "mongodb"
import CnxMongoDB from "../DBMongo.js"

class ModelMongoDB {
    obtenerClases = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const clase = await CnxMongoDB.db.collection('clases').findOne({_id: new ObjectId(id)})
            return clase
        }
        else {
            const clases = await CnxMongoDB.db.collection('clases').find({}).toArray()
            return clases
        }
    }

    guardarClase = async clase => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection('clases').insertOne(clase)
        return clase
    }

    actualizarClase = async (id, clase) => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection('clases').updateOne(
            { _id: new ObjectId(id) },
            { $set: clase }
        )

        const clasesActualizada = await this.obtenerClases(id)
        return clasesActualizada
    }

    

    borrarClase = async id => {
        if(!CnxMongoDB.connection) return {}

        const claseABorrar = await this.obtenerClases(id)
        await CnxMongoDB.db.collection('clases').deleteOne( { _id: new ObjectId(id) })
        return claseABorrar
    }
}

export default ModelMongoDB