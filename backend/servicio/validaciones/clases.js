import Joi from 'joi'

export const validarClase = clase => {

    const claseSchema = Joi.object({

        descripcion: Joi.string().alphanum().required(),
        nombreProfesor: Joi.string().alphanum().required(),
        emailProfesor: Joi.string().email().required(),
        horario: Joi.number().integer().required(),
        capacidad: Joi.number().integer().required(),
       
    });
    

    const {error} = claseSchema.validate(clase)
    if(error) {
        return { result : false, error }
    } 
    return {result: true}




}