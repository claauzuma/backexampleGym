import express from 'express'
import ControladorUsuarios from '../controlador/usuarios.js'
import ControladorNutritionix from '../controlador/nutritionixAPI.js';



class Router {
    constructor(persistencia) {
        this.router = express.Router()
        this.controladorUsuarios = new ControladorUsuarios(persistencia)
        this.controladorNutritionix = new ControladorNutritionix()
        
    }

    start() {
      
        this.router.get('/profesores/:id?', this.controladorUsuarios.obtenerProfes)
        this.router.get('/alumnos/:id?', this.controladorUsuarios.obtenerAlumnos)
        this.router.get('/admin/clases/:id', this.controladorUsuarios.obtenerInscriptos)

        this.router.post('/login', this.controladorUsuarios.logearUsuario)
        this.router.post('/alumnos', this.controladorUsuarios.agregarAlumno)
        this.router.post('/profesores', this.controladorUsuarios.agregarProfesor)
        this.router.post('/clases/agregar/:id', this.controladorUsuarios.inscribirAClase)
        this.router.post('/calorias', this.controladorNutritionix.obtenerEjercicio);

        this.router.put('/:id', this.controladorUsuarios.modificarUsuario)
        this.router.put('/email/:id', this.controladorUsuarios.modificarEmail)
        this.router.put('/contrasenia/:id', this.controladorUsuarios.modificarContraseña)

        this.router.delete('/clases/desuscribir/:id', this.controladorUsuarios.desuscribirseDeClase)
        this.router.delete('/:id', this.controladorUsuarios.borrarUsuario)
    


        return this.router
    }
}

export default Router
