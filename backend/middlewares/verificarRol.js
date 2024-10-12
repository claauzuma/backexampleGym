const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        try {
            const decoded = jwt.verify(token, 'clave_secreta');
            if (!rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token no válido' });
        }
    };
};

export default verificarRol;
