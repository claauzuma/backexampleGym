import Joi from 'joi';
import bcrypt from 'bcrypt';

export const validarAdmin = async (admin) => {
    const adminSchema = Joi.object({
        nombre: Joi.string().regex(/^[a-zA-Z ]+$/).required()
            .messages({
                "string.pattern.base": "El nombre solo puede contener letras y espacios.",
                "string.empty": "El nombre es requerido."
            }),
        apellido: Joi.string().regex(/^[a-zA-Z ]+$/).required()
            .messages({
                "string.pattern.base": "El apellido solo puede contener letras y espacios.",
                "string.empty": "El apellido es requerido."
            }),
        dni: Joi.string().regex(/^\d+$/).length(8).required()
            .messages({
                "string.pattern.base": "El DNI solo debe contener números.",
                "string.length": "El DNI debe tener exactamente 8 dígitos.",
                "string.empty": "El DNI es requerido."
            }),
        email: Joi.string().email().required()
            .messages({
                "string.email": "Debe proporcionar un email válido.",
                "string.empty": "El email es requerido."
            }),
        password: Joi.string().min(6).required()
            .messages({
                "string.min": "La contraseña debe tener al menos 6 caracteres.",
                "string.empty": "La contraseña es requerida."
            }),

    });

    const { error } = adminSchema.validate(admin);
    if (error) {
        return { result: false, error };
    }


    const saltRounds = 10;
    admin.password = await bcrypt.hash(admin.password, saltRounds);

    return { result: true, admin }; 
};
