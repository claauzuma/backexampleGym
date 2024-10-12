//import ModelMem from '../model/DAO/productosMem.js'
//import ModelFile from '../model/DAO/productosFile.js'
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import ModelFactoryUsuarios from "../model/DAO/usuariosFactory.js"
import ModelFactoryRutinas from "../model/DAO/rutinasFactory.js"
import ModelFactoryClases from "../model/DAO/clasesFactory.js"


import { validarAlumno } from "./validaciones/alumnos.js"
import { validarProfesor } from "./validaciones/profesores.js"
import { validarAdmin } from "./validaciones/admin.js"


class Servicio {
    constructor(persistencia) {
        //this.model = new ModelMem()
        //this.model = new ModelFile()
        this.model = ModelFactoryUsuarios.get(persistencia)
        this.modelRutinas = ModelFactoryRutinas.get(persistencia)
        this.modelClases = ModelFactoryClases.get(persistencia)
    }

    obtenerUsuarios = async id => {
        if (id) {	
        return await this.model.obtenerUsuarios(id)
        } else{
            const usuarios = await this.model.obtenerUsuarios(id)
            return usuarios
        }
    }   

    obtenerAdmins = async id => {
        if (id) {	
            return await this.model.obtenerUsuarios(id)
        } else {
            const usuarios = await this.model.obtenerUsuarios(id)
            const admins = usuarios.filter(u => u.rol =="admin")
            return admins
        }
        
    }   

    obtenerProfes = async id => {
        if (id) {	
            return await this.model.obtenerUsuarios(id)
        } else {
            const usuarios = await this.model.obtenerUsuarios(id)
            const profes = usuarios.filter(u => u.rol =="profe")
            return profes
        }
        
    }   

    obtenerAlumnos = async id => {
        if (id) {	
        return await this.model.obtenerUsuarios(id)
        } else {
            const usuarios = await this.model.obtenerUsuarios(id)
            const alumnos = usuarios.filter(u => u.rol =="alumno")
            return alumnos
        }
        
    }   

    
    obtenerInscriptos = async idClase => {
        const alumnos = await this.obtenerAlumnos()
        const inscriptos = [] ;
        
        alumnos.forEach(alumno => {

            const claseExistente = alumno.clasesInscriptas.find(c => c == idClase)
            if(claseExistente != null) {
                console.log("Se pusheo al alumno " + alumno.nombre)
                inscriptos.push(alumno)
            }
              
    
            });
       
            
        return inscriptos
    }   


    logearUsuario = async (email, password) => {
        try {
            console.log("Intentamos logear al usuario en la capa de servicios: " + email);
    
            const usuarios = await this.model.obtenerUsuarios();
            const userDb = usuarios.find(u => u.email === email);
            if (!userDb) {
                console.log("Usuario no encontrado");
                return { message: 'Usuario no encontrado' };
            }
            const match = await bcrypt.compare(password, userDb.password);
            if (!match) {
                console.log("Contraseña incorrecta");
                return { message: 'Contraseña incorrecta' };
            }
            console.log("Usuario logueado exitosamente");
            const token = jsonwebtoken.sign({
                email: userDb.email,
                rol: userDb.rol,
                plan: userDb.plan,
                id: userDb.id
            }, 'clave_secreta', { expiresIn: '1h' });
    
            return token;
        } catch (error) {
            console.error("Error al logear al usuario:", error);
            return { message: 'Error en el servidor' };
        }
    };



    agregarAdmin = async (admin) => {
        try {

            const res = await validarAdmin(admin);
            
            if (res.result) {
                const usuarios = await this.obtenerUsuarios();
                const usuarioExistente = usuarios.find(u => u.email === admin.email);
    
                if (!usuarioExistente) {
                    console.log("El email no está repetido, así que todo ok");
    
                    admin.rol = "admin";

    
    
                    const adminAgregado = await this.model.guardarUsuario(admin);
                    return adminAgregado;
                } else {
                    console.log("El email ya existe");
                    throw new Error("El email ya está en uso");
                }
            } else {
                console.log(res.error);
                throw res.error;
            }
        } catch (error) {

            console.error("Error al agregar admin:", error);
            throw error;
        }
    };

    
    agregarAlumno = async (alumno) => {
        try {

            const res = await validarAlumno(alumno);
            
            if (res.result) {
                const usuarios = await this.obtenerUsuarios();
                const usuarioExistente = usuarios.find(u => u.email === alumno.email);
    
                if (!usuarioExistente) {
                    console.log("El email no está repetido, así que todo ok");
    
        
                    alumno.rol = "alumno";
                    alumno.tieneRutina = false;
                    alumno.clasesInscriptas = [];
    
    
                    const alumnoAgregado = await this.model.guardarUsuario(alumno);
                    return alumnoAgregado;
                } else {
                    console.log("El email ya existe");
                    throw new Error("El email ya está en uso");
                }
            } else {
                console.log(res.error);
                throw res.error;
            }
        } catch (error) {

            console.error("Error al agregar alumno:", error);
            throw error;
        }
    };
    agregarProfesor = async (profesor) => {
        try {
            const res = await validarProfesor(profesor); 
            if (res.result) {
                const usuarios = this.obtenerUsuarios();
                profesor.id = parseInt(usuarios[usuarios.length - 1]?.id || 0) + 1;
                profesor.rol = "profe";
    
                const profeAgregado = await this.model.guardarUsuario(profesor);
                return profeAgregado;
            } else {
                console.log(res.error);
                throw new Error(res.error.details[0].message); 
            }
        } catch (error) {
            console.error('Error al agregar profesor:', error);
            throw error; 
        }
    };


    inscribirAClase = async (idClase, idUsuario) => {
        try {
       
            const usuario = await this.model.obtenerUsuarios(idUsuario);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
    
            let claseDeUsuario = "sinClase";
    
      
            if (usuario.clasesInscriptas.length > 0) {
                claseDeUsuario = usuario.clasesInscriptas.find(IDclaseInscripta => IDclaseInscripta == idClase);
                console.log(claseDeUsuario);
                if (claseDeUsuario !== "sinClase") {
                    throw new Error('Error, el alumno ya está inscripto a dicha clase');
                } else {
                    console.log("Perfecto, el usuario no está inscripto a esa clase");
                }
            }
    
     
            console.log("El usuario puede inscribirse a la clase, así que procedemos a buscar la clase");
    
            const clases = await this.modelClases.obtenerClases();
            const clase = clases.find(c => c._id == idClase);
            if (!clase) {
                throw new Error('Clase no encontrada');
            }
    
            console.log(clase.anotados + " " + clase.capacidad);
    
            if (clase.anotados < clase.capacidad) {
                console.log("Hay capacidad, perfecto");
                console.log("Hay " + clase.anotados + " anotados");
                console.log("Nos anotamos perfectamente a la clase de " +clase.descripcion)
    
                clase.anotados++; 
                clase.alumnosInscriptos.push(idUsuario)
                usuario.clasesInscriptas.push(idClase); 
    
            
                await this.model.actualizarUsuario(usuario._id, usuario);
                await this.modelClases.actualizarClase(clase._id, clase); 
    
                console.log("Agregamos la clase a la lista y hay más anotados en la clase " + clase.anotados);
                return usuario; 
            } else {
                throw new Error('Error en capacidad de clase');
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    };


    desuscribirseDeClase = async (idClase, idUsuario) => {
        console.log("Arrancamos el metodo");
        
        const usuario = await this.model.obtenerUsuarios(idUsuario); 
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        let claseDeUsuario = "SinClase";
        claseDeUsuario = usuario.clasesInscriptas.find(IDclaseInscripta => IDclaseInscripta == idClase);
        
        if (usuario.clasesInscriptas.length > 0 && claseDeUsuario != "SinClase") {
            console.log("El usuario tiene al menos una clase inscripta");
            
      
            const clases = await this.modelClases.obtenerClases();
            const clase = clases.find(c => c._id == idClase);
            
            if (!clase) {
                throw new Error('Clase no encontrada');
            }
            
          
            usuario.clasesInscriptas = usuario.clasesInscriptas.filter(IDclaseInscripta => IDclaseInscripta !== idClase);
            
            
            clase.anotados--;
            clase.alumnosInscriptos = clase.alumnosInscriptos.filter(id => id !== idUsuario);
    
            await this.modelClases.actualizarClase(clase._id, clase);
            await this.model.actualizarUsuario(usuario._id, usuario);
            
            console.log("Se actualizo todo ok");
            return usuario;
        } else {
            throw new Error('Error, el alumno no se encuentra inscripto a la clase');
        }
    }
    
 
    modificarUsuario = async (id, usuario) => {
        const usuarioActualizado = await this.model.actualizarUsuario(id,usuario)
        return usuarioActualizado
    }

    modificarEmail = async (id, objeto) => {
        console.log(objeto.nuevoEmail)
        console.log(objeto.nuevaContraseña)
        const nuevoEmail = objeto.nuevoEmail
        const contraseñaAComparar = objeto.contraseña
        const usuario = await this.model.obtenerUsuarios(id)
        const contraseñaCorrecta = usuario.contraseña == contraseñaAComparar
        if (contraseñaCorrecta) {
            usuario.email = nuevoEmail
            this.model.actualizarUsuario(usuario._id,usuario)
            return usuario

        }
        else {
            return {}
        }

    }

    modificarContraseña = async (id, objeto) => {
        const contraNueva = objeto.nuevaContraseña
        const contraseñaAComparar = objeto.contraseña
        const usuario = await this.model.obtenerUsuarios(id)
        const contraseñaCorrecta = usuario.contraseña == contraseñaAComparar
        if (contraseñaCorrecta) {
            usuario.contraseña = contraNueva
            return usuario

        }
        else {
            return {}
        }

    }

    borrarUsuario = async id => {
        const usuarioBorrado = await this.model.borrarUsuario(id)
        console.log("Eliminando a " + usuarioBorrado.nombre)

        if(usuarioBorrado.rol == "alumno" && usuarioBorrado.tieneRutina) {
            console.log("Ojo el dibu tiene una rutina ")
            const rutinas = await this.modelRutinas.obtenerRutinas()
            const rutinaABorrar = rutinas.find(r => r.nombreAlumno == usuarioBorrado.nombre && r.dniAlumno == usuarioBorrado.dni)
            if(rutinaABorrar != null) {
                console.log("Eliminamos su rutina tambien entonces")
                await this.modelRutinas.borrarRutina(rutinaABorrar._id)
            }    
        }

        if(usuarioBorrado.rol =="profe") {
            console.log("El usuario borrado es un probe")
            const clases = await this.modelClases.obtenerClases()
            const claseABorrar = clases.find(c=> c.nombreProfesor = usuarioBorrado.nombre && c.emailProfesor == usuarioBorrado.email)
            if(claseABorrar != null) {
                console.log("Borramos la clase de dicho profe")
                await this.modelClases.borrarClase(claseABorrar._id)

            }


        }
         return usuarioBorrado
    }
}

export default Servicio