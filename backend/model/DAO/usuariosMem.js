class ModelMem {
    constructor() {

        this.admins = [{email:'admin@test.com',password:'1234','rol':'admin'}]
        this.usuarios = [
          {email:'user@test.com',password:'1234','rol':'user'}
        ]
    }

    obtenerUsuarios = async id => {    
        if(id) {
            const usuario = this.usuarios.find( usuario => usuario.id === id )
            return usuario || {}
        }
        else {
            return this.usuarios
        }
    }
    
    modificarUsuario = async (id, usuario) => {
        usuario.id = id

        const index = this.usuarios.findIndex( usuario => usuario.id === id )
        if(index != -1) {
            const usuarioAnt = this.usuarios[index]
            const usuarioNuevo = { ...usuarioAnt, ...usuario }
            this.usuarios.splice(index,1,usuarioNuevo)
            return usuarioNuevo
        }
        else {
            this.usuarios.push(usuario)
            return usuario
        }
    }


    agregarUsuario = async usuario => {
        usuario.id = String(parseInt(this.productos[this.productos.length - 1]?.id || 0) + 1) // ?. optional chaining
        producto.precio = Number(producto.precio)
        producto.stock = Number(producto.stock)
        this.productos.push(producto)
        return producto
    }


    logearUsuario = async usuario => {    
        if(id) {
            const usuario = this.usuarios.find( usuario => usuario.id === id )
            return usuario || {}
        }
        else {
            return this.usuarios
        }
    }

   

    borrarUsuario = async id => {
        let usuario = {}

        const index = this.usuarios.findIndex( usuario => usuario.id === id )
        if(index != -1) {
            usuario = this.usuarios.splice(index,1)[0]
        }
        return usuario    
    }
}

export default ModelMem