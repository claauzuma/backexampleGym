import Joi from 'joi'

export const validarAlumno = alumno => {

    const alumnoSchema = Joi.object({
        nombre: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        apellido: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        dni: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        email: Joi.string().email().required(), 
        contraseña: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        ingreso: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
        plan: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
      
    });
    

   
    const {error} = alumnoSchema.validate(alumno)
    if(error) {
        return { result : false, error }
    } 
    return {result: true}



}