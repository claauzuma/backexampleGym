import express from 'express'
import ControladorRutinas from '../controlador/rutinas.js'


class Router {
    constructor(persistencia) {
        this.router = express.Router()
        this.controladorRutinas = new ControladorRutinas(persistencia)
        
    }

    start() {
        this.router.get('/:id?', this.controladorRutinas.obtenerRutinas)

        this.router.post('/agregar', this.controladorRutinas.agregarRutina)

        this.router.put('/:id', this.controladorRutinas.modificarRutina)

        this.router.delete('/:id', this.controladorRutinas.borrarRutina)


        return this.router
    }
}

export default Router
