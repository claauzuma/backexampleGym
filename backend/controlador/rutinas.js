import Servicio from '../servicio/rutinas.js'


class ControladorRutinas {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }

    obtenerRutinas = async (req,res) => {
        const { id } = req.params
        const rutinas = await this.servicio.obtenerRutinas(id)
        res.json(rutinas)
    }

    agregarRutina = async (req, res) => {
        if (req.body) {
            const rutina = req.body
            const rutinaAgregada = await this.servicio.agregarRutina(rutina)
            res.json(rutinaAgregada)

        }
        else {
            res.status(400).json({ message: 'error' })

        }

    }

    borrarRutina = async (req,res) => {
        const { id } = req.params
        const rutinaBorrada = await this.servicio.borrarRutina(id)
        res.json(rutinaBorrada)
    }

    modificarRutina = async (req,res) => {
        const { id } = req.params
        const rutina = req.body
        const rutinaModificada = await this.servicio.modificarRutina(id,rutina)
        res.json(rutinaModificada)
    }

   
}

export default ControladorRutinas