import Servicio from '../servicio/usuarios.js'


class ControladorUsuarios {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }

    

    obtenerProfes = async (req,res) => {
        const { id } = req.params
        const profes = await this.servicio.obtenerProfes(id)
        res.json(profes)
    }

    obtenerAlumnos = async (req,res) => {
        const { id } = req.params
        const alumnos = await this.servicio.obtenerAlumnos(id)
        res.json(alumnos)
    }

    obtenerInscriptos = async (req,res) => {
        const { id } = req.params
        const inscriptos = await this.servicio.obtenerInscriptos(id)
        res.json(inscriptos)
    }


    logearUsuario = async (req, res) => {
        console.log("Intentamos logear al usuario")
        if (req.body) {

            const {email} = req.body
            const {password} = req.body
            console.log(email, password)
            const usuarioLogeado = await this.servicio.logearUsuario(email, password)
            const {password: _, ...publicUser} = usuarioLogeado;
            res.json(publicUser)

        }
        else {
            res.status(400).json({ message: 'error' })
        }

    }


    agregarAlumno = async (req, res) => {
        if (req.body) {
            const alumno = req.body
            const alumnoAgregado = await this.servicio.agregarAlumno(alumno)
            res.json(alumnoAgregado)

        }
        else {
            res.status(404).json({ message: 'falta el body' })
        }

    }

    agregarProfesor = async (req,res) => {
        if (req.body) {
        const profesor = req.body
        const profesorAgregado = await this.servicio.agregarProfesor(profesor)
        res.json(profesorAgregado)
        }
        else {
          res.status(404).json({ message: 'falta el body' })

        }
    }


    inscribirAClase = async (req, res) => {
        if (req.body) {
            const { id: idClase } = req.params
            const usuario = req.body;
            const usuarioInscripto = await this.servicio.inscribirAClase(idClase,usuario)
            res.json(usuarioInscripto)
        }
        else 
        {
            res.status(400).json({message:'error'})
        }

    }

    desuscribirseDeClase = async (req, res) => {
        if (req.body && req.params) {
            const { id: idClase } = req.params
            const usuario = req.body;
            console.log("Vamos al servicio para desuscribirnos de la clase")
            const usuarioDesuscripto = await this.servicio.desuscribirseDeClase(idClase,usuario)

            res.json(usuarioDesuscripto)
        }
        else 
        {
            res.status(400).json({message:'error'})
        }

    }


    modificarUsuario = async (req,res) => {
        const { id } = req.params
        const usuario = req.body
        const usuarioModificado = await this.servicio.modificarUsuario(id, usuario)
        res.json(usuarioModificado)
    }

    modificarEmail = async (req,res) => {
        const { id } = req.params
        const objeto = req.body
        const usuarioActualizado = await this.servicio.modificarEmail(id, objeto)
        res.json(usuarioActualizado)
    }

    modificarContraseña = async (req,res) => {
        const { id } = req.params
        const objeto = req.body
        const usuarioActualizado = await this.servicio.modificarContraseña(id, objeto)
        res.json(usuarioActualizado)
    }



    borrarUsuario = async (req,res) => {
        const { id } = req.params
        const usuarioBorrado = await this.servicio.borrarUsuario(id)
        res.json(usuarioBorrado)
    }

    desuscribirseDeClase = async (req,res) => {
        const { id } = req.params
        const estado = await this.servicio.borrarUsuario(id)
        res.json(estado)
    }


}

export default ControladorUsuarios
