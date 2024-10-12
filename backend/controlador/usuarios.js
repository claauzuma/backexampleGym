import Servicio from '../servicio/usuarios.js'


class ControladorUsuarios {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }

    obtenerAdmins = async (req,res) => {
        const { id } = req.params
        const admins = await this.servicio.obtenerAdmins(id)
        res.json(admins)
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
        try {
            console.log("Intentamos logear al usuario");
    
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }
    
            console.log(email, password);
    
            // Llama al servicio para logear al usuario
            const token = await this.servicio.logearUsuario(email, password);
    
            if (token) {
                // Configura la cookie con el token
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Asegúrate de que sea seguro en producción
                    sameSite: 'strict', 
                    maxAge: 60 * 60 * 1000 // 1 hora
                });
             
                return res.json({ token }); // Devuelve solo el token
    
            } else {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (error) {
            console.error("Error al logear al usuario:", error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    };


    agregarAdmin = async (req, res) => {
        if (req.body) {
            const admin = req.body
            const adminAgregado = await this.servicio.agregarAdmin(admin)
            res.json(adminAgregado)

        }
        else {
            res.status(404).json({ message: 'falta el body' })
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
            const { idClase, idUsuario } = req.params
            const usuarioInscripto = await this.servicio.inscribirAClase(idClase,idUsuario)
            res.json(usuarioInscripto)
        }
        else 
        {
            res.status(400).json({message:'error'})
        }

    }

    desuscribirseDeClase = async (req, res) => {
        if (req.params.idClase && req.params.idAlumno) {
            
            const {idClase, idAlumno } = req.params
            console.log("Vamos al servicio para desuscribirnos de la clase")
            const usuarioDesuscripto = await this.servicio.desuscribirseDeClase(idClase,idAlumno)

            res.json(usuarioDesuscripto)
        }
        else 
        {
            res.status(400).json({message:'error'})
        }

    }

    modificarUsuario = async (req, res) => {
        const { id } = req.params;  
        const usuario = req.body;   
    
        if (usuario._id) {
            delete usuario._id;
        }
    
        try {
            const usuarioModificado = await this.servicio.modificarUsuario(id, usuario);
            res.status(200).json(usuarioModificado);
        } catch (error) {
            res.status(500).json({ message: "Error al modificar el usuario", error });
        }
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




}

export default ControladorUsuarios
