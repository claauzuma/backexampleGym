import Servicio from '../servicio/clases.js'


class ControladorClases {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }

    obtenerClases = async (req,res) => {
        const { id } = req.params
        const clases = await this.servicio.obtenerClases(id)
        res.json(clases)
    }

    agregarClase = async (req, res) => {
        
        if (req.body) {
            const clase = req.body
            const claseAgregada = await this.servicio.agregarClase(clase)
            res.json(claseAgregada)

        }
        else {
            res.status(400).json({ message: 'error' })

        }

    }

    borrarClase = async (req,res) => {
        const { id } = req.params
        const claseBorrada = await this.servicio.borrarClase(id)
        res.json(claseBorrada)
    }

    

   
}

export default ControladorClases