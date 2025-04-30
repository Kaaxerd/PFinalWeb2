const { check } = require('express-validator');
const handleValidator = require('../utils/handleValidator');

const validateRegister = [
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty().isLength({ min: 8 }), // Mínimo 8 caracteres para la contraseña
    check('name').optional().isString(),
    check('lastname').optional().isString(),
    check('nif').optional().isLength({ min: 9, max: 9 }).isString(), // NIF con 9 caracteres
    check('company').optional().isMongoId(),
    check('autonomous').optional().isBoolean(),

    (req, res, next) => {
        handleValidator(req, res, next);
    }
];

const validateLogin = [
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty(),
    
    (req, res, next) => {
        handleValidator(req, res, next);
    }
];

const validateGetUser = [
    check('id').exists().notEmpty().isMongoId(),
    
    (req, res, next) => {
        handleValidator(req, res, next);
    }
];

module.exports = { validateRegister, validateLogin, validateGetUser };