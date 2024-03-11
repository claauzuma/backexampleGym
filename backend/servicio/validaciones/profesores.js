import Joi from 'joi'

export const validarProfesor = profesor => {

    const profesorSchema = Joi.object({
        nombre: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        apellido: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        dni: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        email: Joi.string().email().required(), 
        contraseña: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
   
    });
    

    const {error} = profesorSchema.validate(profesor)
    if(error) {
        return { result : false, error }
    } 
    return {result: true}




}