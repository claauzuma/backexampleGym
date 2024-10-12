import ModelFactory from "../model/DAO/clasesFactory.js"
import ModelFactoryUsuarios from "../model/DAO/usuariosFactory.js"
import { validarClase } from "./validaciones/clases.js"



class Servicio {
    constructor(persistencia) {
        //this.model = new ModelMem()
        //this.model = new ModelFile()
        this.model = ModelFactory.get(persistencia)
        this.modelUsuarios = ModelFactoryUsuarios.get(persistencia)

    }

    obtenerClases = async id => {
        const clases = await this.model.obtenerClases(id)
        return clases
    }   

    agregarClase = async clase => {

        const res = validarClase(clase)
        try {
            if (res.result) {
                const usuarios = await this.modelUsuarios.obtenerUsuarios();

                const profesorExistente = usuarios.find(u => u.rol == "profe" && u.nombre == clase.nombreProfesor && u.email == clase.emailProfesor)
                if (profesorExistente != null) {
                    console.log("joya, el profesor existe")
                    clase.alumnosInscriptos = []
                    clase.anotados = 0;

                    const claseAgregada = await this.model.guardarClase(clase)
                    console.log("Se guardo la clase correctamente")
                    return claseAgregada

                }
                else {
                    throw "El profesor no existe"

                }



            }
            else {
                console.log(res.error)
                throw res.error


            }

        }
        catch (error) {
            console.log(error)

        }



    }
    modificarClase = async (id, clase) => {
    const claseModificada = this.model.actualizarClase(id,clase);
    return claseModificada;

    }

    borrarClase = async idClase => {
        const claseBorrada = await this.model.borrarClase(idClase)
        const usuarios = await this.modelUsuarios.obtenerUsuarios();
        const alumnos = usuarios.filter(a => a.rol == "alumno")

        alumnos.forEach(alumno => {
        
         const claseEncontrada = alumno.clasesInscriptas.find(id => id == idClase)
          if(claseEncontrada != null) {
            console.log("Eliminamos la clase del usuario " +claseEncontrada)
            alumno.clasesInscriptas.splice(claseEncontrada,1)
            this.modelUsuarios.actualizarUsuario(alumno._id,alumno)

          }
          else {
            console.log("El alumno no tiene ninguna clase ")
          }
          

        });





        return claseBorrada
    }



}

export default Servicio