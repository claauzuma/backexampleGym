import Servicio from '../servicio/usuarios.js';

class ControladorUsuarios {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia);
    }

    obtenerAdmins = async (req, res) => {
        try {
            const { id } = req.params;
            const admins = await this.servicio.obtenerAdmins(id);
            res.json(admins);
        } catch (error) {
            console.error("Error al obtener administradores:", error);
            res.status(500).json({ message: 'Error al obtener administradores' });
        }
    }

    obtenerProfes = async (req, res) => {
        try {
            const { id } = req.params;
            const profes = await this.servicio.obtenerProfes(id);
            res.json(profes);
        } catch (error) {
            console.error("Error al obtener profesores:", error);
            res.status(500).json({ message: 'Error al obtener profesores' });
        }
    }

    obtenerAlumnos = async (req, res) => {
        try {
            const { id } = req.params;
            const alumnos = await this.servicio.obtenerAlumnos(id);
            res.json(alumnos);
        } catch (error) {
            console.error("Error al obtener alumnos:", error);
            res.status(500).json({ message: 'Error al obtener alumnos' });
        }
    }

    obtenerInscriptos = async (req, res) => {
        try {
            const { id } = req.params;
            const inscriptos = await this.servicio.obtenerInscriptos(id);
            res.json(inscriptos);
        } catch (error) {
            console.error("Error al obtener inscriptos:", error);
            res.status(500).json({ message: 'Error al obtener inscriptos' });
        }
    }

    logearUsuario = async (req, res) => {
        try {
            console.log("Intentamos logear al usuario");
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }

            console.log(email, password);
            const token = await this.servicio.logearUsuario(email, password);

            if (token) {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000 // 1 hora
                });
                return res.json({ token });
            } else {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (error) {
            console.error("Error al logear al usuario:", error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    };

    agregarAdmin = async (req, res) => {
        try {
            if (req.body) {
                const admin = req.body;
                const adminAgregado = await this.servicio.agregarAdmin(admin);
                res.json(adminAgregado);
            } else {
                res.status(404).json({ message: 'Falta el body' });
            }
        } catch (error) {
            console.error("Error al agregar admin:", error);
            res.status(500).json({ message: 'Error al agregar admin' });
        }
    }

    agregarAlumno = async (req, res) => {
        try {
            if (req.body) {
                const alumno = req.body;
                const alumnoAgregado = await this.servicio.agregarAlumno(alumno);
                res.status(201).json(alumnoAgregado); // Respuesta exitosa con el código 201 (Created)
            } else {
                res.status(400).json({ message: 'Falta el body' }); // Respuesta cuando falta el body
            }
        } catch (error) {
            console.error("Error al agregar alumno:", error.message);
    
            if (error.message === "El email ya está en uso") {
                res.status(409).json({ message: error.message }); // Código 409: Conflicto, para email duplicado
            } else {
                res.status(500).json({ message: 'Error al agregar alumno' }); // Código 500: Error genérico del servidor
            }
        }
    };

    agregarProfesor = async (req, res) => {
        try {
            if (req.body) {
                const profesor = req.body;
                const profesorAgregado = await this.servicio.agregarProfesor(profesor);
                res.json(profesorAgregado);
            } else {
                res.status(404).json({ message: 'Falta el body' });
            }
        } catch (error) {
            console.error("Error al agregar profesor:", error);
            res.status(500).json({ message: 'Error al agregar profesor' });
        }
    }

    inscribirAClase = async (req, res) => {
        try {
            if (req.body) {
                const { idClase, idUsuario } = req.params;
                const usuarioInscripto = await this.servicio.inscribirAClase(idClase, idUsuario);
                return res.json(usuarioInscripto);
            } else {
                return res.status(400).json({ message: 'Error: Datos no proporcionados' });
            }
        } catch (error) {
            console.error("Error al inscribir al usuario:", error.message);
            return res.status(500).json({ message: `Error al inscribir al usuario: ${error.message}` });
        }
    };

    desuscribirseDeClase = async (req, res) => {
        try {
            if (req.params.idClase && req.params.idAlumno) {
                const { idClase, idAlumno } = req.params;
                console.log("Vamos al servicio para desuscribirnos de la clase");
                const usuarioDesuscripto = await this.servicio.desuscribirseDeClase(idClase, idAlumno);
                res.json(usuarioDesuscripto);
            } else {
                res.status(400).json({ message: 'Error: Parámetros no proporcionados' });
            }
        } catch (error) {
            console.error("Error al desuscribirse de la clase:", error);
            res.status(500).json({ message: 'Error al desuscribirse de la clase' });
        }
    }

    modificarUsuario = async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = req.body;

            if (usuario._id) {
                delete usuario._id;
            }

            const usuarioModificado = await this.servicio.modificarUsuario(id, usuario);
            res.status(200).json(usuarioModificado);
        } catch (error) {
            console.error("Error al modificar el usuario:", error);
            res.status(500).json({ message: "Error al modificar el usuario", error });
        }
    }

    modificarEmail = async (req, res) => {
        try {
            const { id } = req.params;
            const objeto = req.body;
            const usuarioActualizado = await this.servicio.modificarEmail(id, objeto);
            res.json(usuarioActualizado);
        } catch (error) {
            console.error("Error al modificar el email:", error);
            res.status(500).json({ message: 'Error al modificar el email' });
        }
    }

    modificarContraseña = async (req, res) => {
        try {
            const { id } = req.params;
            const objeto = req.body;
            const usuarioActualizado = await this.servicio.modificarContraseña(id, objeto);
            res.json(usuarioActualizado);
        } catch (error) {
            console.error("Error al modificar la contraseña:", error);
            res.status(500).json({ message: 'Error al modificar la contraseña' });
        }
    }

    borrarUsuario = async (req, res) => {
        try {
            const { id } = req.params;
            const usuarioBorrado = await this.servicio.borrarUsuario(id);
            res.json(usuarioBorrado);
        } catch (error) {
            console.error("Error al borrar el usuario:", error);
            res.status(500).json({ message: 'Error al borrar el usuario' });
        }
    }
}

export default ControladorUsuarios;
