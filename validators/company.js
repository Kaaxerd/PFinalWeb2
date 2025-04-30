const { check } = require('express-validator');
const handleValidator = require('../utils/handleValidator');

const validateCompany = [
    check('name').exists().notEmpty().withMessage('El nombre es obligatorio'),
    check('cif').exists().notEmpty().withMessage('El CIF es obligatorio'),
    check('street').exists().notEmpty().withMessage('La calle es obligatoria'),
    check('number').exists().isNumeric().withMessage('El número debe ser numérico'),
    check('postal').exists().isNumeric().withMessage('El código postal debe ser numérico'),
    check('city').exists().notEmpty().withMessage('La ciudad es obligatoria'),
    check('province').exists().notEmpty().withMessage('La provincia es obligatoria'),
    (req, res, next) => {
        handleValidator(req, res, next);
    }
];

const validateCompanyUpdate = [
    // Todos los campos son opcionales en una actualización parcial
    check('name').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
    check('cif').optional().isString().withMessage('El CIF debe ser una cadena de texto'),
    check('street').optional().isString().withMessage('La calle debe ser una cadena de texto'),
    check('number').optional().isNumeric().withMessage('El número debe ser numérico'),
    check('postal').optional().isNumeric().withMessage('El código postal debe ser numérico'),
    check('city').optional().isString().withMessage('La ciudad debe ser una cadena de texto'),
    check('province').optional().isString().withMessage('La provincia debe ser una cadena de texto'),
    (req, res, next) => {
        handleValidator(req, res, next);
    }
];

module.exports = { validateCompany, validateCompanyUpdate };