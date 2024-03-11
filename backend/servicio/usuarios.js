//import ModelMem from '../model/DAO/productosMem.js'
//import ModelFile from '../model/DAO/productosFile.js'
import jsonwebtoken from 'jsonwebtoken';


import ModelFactoryUsuarios from "../model/DAO/usuariosFactory.js"
import ModelFactoryRutinas from "../model/DAO/rutinasFactory.js"
import ModelFactoryClases from "../model/DAO/clasesFactory.js"


import { validarAlumno } from "./validaciones/alumnos.js"
import { validarProfesor } from "./validaciones/profesores.js"


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


    logearUsuario = async usuarioIngresado => {
        const usuarios = await this.model.obtenerUsuarios()
        const userDb = usuarios.find(u => u.email == usuarioIngresado.email && u.password == usuarioIngresado.password)
        if (userDb) {
            const token = jsonwebtoken.sign({
                email: userDb.email, rol: userDb.rol, plan: userDb.plan,
                id: userDb.id
            }, 'clave_secreta')
            return { token: token }
        } else {
            return { message: 'error' }
        }



    }   

    agregarAlumno = async alumno => {
        const res = validarAlumno(alumno)
        if (res.result) {
            const usuarios = await this.obtenerUsuarios();
            const usuarioExistente = usuarios.find(u => u.email == alumno.email)
            if (usuarioExistente == null) {
                console.log("El email no esta repetido asi que todo ok")
                alumno.rol = "alumno"
                alumno.tieneRutina = false;
                alumno.clasesInscriptas =[]

                const alumnoAgregado = await this.model.guardarUsuario(alumno)
                return alumnoAgregado

            }
            else {
                console.log("El mail ya existe")
            }



        }
        else {
            console.log(res.error)
            throw res.error

        }

    }

    agregarProfesor = async profesor => {
        const res = validarProfesor(profesor)
        if (res.result) {
            const usuarios = this.obtenerUsuarios();
            profesor.id = parseInt(usuarios[usuarios.length - 1]?.id || 0) + 1;
            profesor.rol = "profe"

            const profeAgregado = await this.model.guardarUsuario(profesor)
            return profeAgregado

        }
        else {
            console.log(res.error)
            throw res.error

        }

    }


    inscribirAClase = async (idClase, usuario) => {

        console.log(usuario.nombre)

        let claseDeUsuario = "sinClase"
        if (usuario.clasesInscriptas.length > 0) {

            //si el usuario esta inscripto a alguna clase, nos fijamos si la tiene repetida
            claseDeUsuario = usuario.clasesInscriptas.find(IDclaseInscripta => IDclaseInscripta == idClase)
            console.log(claseDeUsuario)
            if (claseDeUsuario == "sinClase") {
                console.log("Perfecto, el usuario no esta inscripto a esa clase")
            }
            else {
                throw new Error('Error, el alumno ya esta inscripto a dicha clase')
            }

        }
        //el usuario no esta inscripto a clases o no la tiene en sus clases inscriptas
        console.log("El usuario puede inscribirse a la clase , asi que procedemos a buscar la clase")

        const clases = await this.modelClases.obtenerClases();
        const clase = clases.find(c => c._id == idClase)
        console.log(clase.anotados + " " + clase.capacidad)

        if (clase.anotados < clase.capacidad) {
            console.log("Hay capacidad, perfecto")
            console.log("Hay " + clase.anotados + " anotados")
            const user = await this.model.obtenerUsuarios(usuario._id)
            clase.anotados++
            this.model.actualizarUsuario(user._id, user)
            //Actualizamos clase y usuario, para que se refleje en la base de datos
            console.log("Agregamos la clase a la lista y hay mas anotados en la clase " + clase.anotados)
            return user;
        }
        else {
            throw new Error('Error en capacidad de clase')

        }




    }

    desuscribirseDeClase = async (idClase, usuario) => {
    console.log("Arrancamos el metodo")
    let claseDeUsuario = "SinClase";
    claseDeUsuario = usuario.clasesInscriptas.find(IDclaseInscripta => IDclaseInscripta == idClase)
    if(usuario.clasesInscriptas.length > 0 && claseDeUsuario != "SinClase") {
        console.log("El usuario tiene al menos una clase inscripta")
     //Si el id de la clase existe, entonces procedo y busco la clase
     const clases = await this.modelClases.obtenerClases();
     const clase = clases.find(c=> c.id == idClase)
     usuario.clasesInscriptas.splice(clase._id,1)
     //a la clase le resto un inscripto
     clase.anotados--
     this.modelClases.actualizarClase(clase._id, clase)
     this.model.actualizarUsuario(usuario._id, usuario)
     console.log("Se actualizo todo ok")
     return usuario;
     

    } else {
     throw new Error('Error, el alumno no se encuentra inscripto a la clase')
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