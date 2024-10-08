import Joi from 'joi';
import bcrypt from 'bcrypt';

export const validarProfesor = async (profesor) => {
    try {
        // Hashear la contraseña antes de la validación
        if (profesor.password) {
            const saltRounds = 10;
            profesor.password = await bcrypt.hash(profesor.password, saltRounds);
        }

        const profesorSchema = Joi.object({
            nombre: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required()
                .messages({
                    "string.empty": "El nombre es requerido."
                }),
            apellido: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required()
                .messages({
                    "string.empty": "El apellido es requerido."
                }),
            dni: Joi.string().regex(/^\d+$/).required()
                .messages({
                    "string.empty": "El DNI es requerido."
                }),
            email: Joi.string().email().required()
                .messages({
                    "string.email": "Debe proporcionar un email válido.",
                    "string.empty": "El email es requerido."
                }),
            password: Joi.string().required()
                .messages({
                    "string.empty": "La contraseña es requerida."
                }),
        });

        const { error } = profesorSchema.validate(profesor);
        if (error) {
            return { result: false, error };
        }

        return { result: true, profesor }; // Devuelve el objeto con la contraseña hasheada
    } catch (err) {
        console.error('Error al validar el profesor:', err);
        return { result: false, error: err.message };
    }
};
