import { ObjectId } from "mongodb"
import CnxMongoDB from "../DBMongo.js"

class ModelMongoDB {
    obtenerRutinas = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const rutina = await CnxMongoDB.db.collection("rutinas").findOne({_id: new ObjectId(id)})
            return rutina
        }
        else {
            const rutinas = await CnxMongoDB.db.collection("rutinas").find({}).toArray()
            return rutinas
        }
    }

    guardarRutina = async rutina => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection("rutinas").insertOne(rutina)
        return rutina
    }

    actualizarRutina = async (id, rutina) => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection("rutinas").updateOne(
            { _id: new ObjectId(id) },
            { $set: rutina }
        )

        const rutinaActualizada = await this.obtenerRutinas(id)
        return rutinaActualizada
    }

    borrarRutina = async id => {
        if(!CnxMongoDB.connection) return {}

        const rutinaABorrar = await this.obtenerRutinas(id)
        await CnxMongoDB.db.collection("rutinas").deleteOne( { _id: new ObjectId(id) })
        return rutinaABorrar
    }
}

export default ModelMongoDB