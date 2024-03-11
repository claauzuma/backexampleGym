import { ObjectId } from "mongodb"
import CnxMongoDB from "../DBMongo.js"

class ModelMongoDB {
    obtenerUsuarios = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const usuario = await CnxMongoDB.db.collection('usuarios').findOne({_id: new ObjectId(id)})
            return usuario
        }
        else {
            const usuarios = await CnxMongoDB.db.collection('usuarios').find({}).toArray()
            return usuarios
        }
    }

    guardarUsuario = async usuario => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection('usuarios').insertOne(usuario)
        return usuario
    }

    actualizarUsuario = async (id, usuario) => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection('usuarios').updateOne(
            { _id: new ObjectId(id) },
            { $set: usuario }
        )

        const usuariosActualizado = await this.obtenerUsuarios(id)
        return usuariosActualizado
    }


    borrarUsuario = async id => {
        if(!CnxMongoDB.connection) return {}

        const usuarioBorrado = await this.obtenerUsuarios(id)
        await CnxMongoDB.db.collection('usuarios').deleteOne( { _id: new ObjectId(id) })
        return usuarioBorrado
    }
}

export default ModelMongoDB