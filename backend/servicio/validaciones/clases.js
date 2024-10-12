import Joi from 'joi'

export const validarClase = clase => {

    const claseSchema = Joi.object({

        descripcion: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required(),
        nombreProfesor: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required(),
        emailProfesor: Joi.string().email().required(),
        horaArranque: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),  // Formato HH:mm
        horaFinalizacion: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Formato HH:mm
        capacidad: Joi.number().integer().required(),
       
    });
    

    const {error} = claseSchema.validate(clase)
    if(error) {
        return { result : false, error }
    } 
    return {result: true}




}