const {validationResult} = require('express-validator');
const User = require('../models/nosql/users');

const handleValidator = async (req, res, next) => {
    try {
        validationResult(req).throw(); // Pasan las validaciones de los datos??

        // Existe el correo en la base de datos??
        if (req.path === '/register') {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(409).send({ message: 'El correo ya está registrado' });
            }
        }

        return next(); // Pasa al siguiente middleware
    } catch (error) {
        res.status(403);
        res.send({errors: error.array()});
    }
};

module.exports = handleValidator;