import express from 'express'
import ControladorClases from '../controlador/clases.js'



class Router {
    constructor(persistencia) {
        this.router = express.Router()
        this.controladorClases = new ControladorClases(persistencia)
    }

    start() {

        this.router.get('/:id?', this.controladorClases.obtenerClases) 
        this.router.post('/', this.controladorClases.agregarClase)
        this.router.delete('/:id', this.controladorClases.borrarClase)

        return this.router
    }
}

export default Router
