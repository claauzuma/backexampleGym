import Joi from 'joi'

export const validarRutina = rutina => {

    const rutinaSchema = Joi.object({

        descripcion: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        nombreAlumno: Joi.string().alphanum().required(),
        dniAlumno: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        nivel: Joi.string().alphanum().required(),
       
    });
    

    const {error} = rutinaSchema.validate(rutina)
    if(error) {
        return { result : false, error }
    } 
    return {result: true}




}