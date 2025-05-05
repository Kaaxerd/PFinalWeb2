const { check } = require('express-validator');
const handleValidator = require('../utils/handleValidator');

const validateCreateClient = [
  check('name')
    .exists().withMessage('El nombre es obligatorio')
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isString().withMessage('El nombre debe ser una cadena de texto'),
  check('nif')
    .exists().withMessage('El NIF es obligatorio')
    .notEmpty().withMessage('El NIF no puede estar vacío')
    .isString().withMessage('El NIF debe ser una cadena de texto'),
  check('email')
    .optional()
    .isEmail().withMessage('El email debe ser válido'),
  check('phone')
    .optional()
    .isString().withMessage('El teléfono debe ser una cadena de texto'),
  check('address')
    .optional()
    .isString().withMessage('La dirección debe ser una cadena de texto'),
  check('postalCode')
    .optional()
    .isString().withMessage('El código postal debe ser una cadena de texto'),
  check('city')
    .optional()
    .isString().withMessage('La ciudad debe ser una cadena de texto'),
  check('province')
    .optional()
    .isString().withMessage('La provincia debe ser una cadena de texto'),
  (req, res, next) => {
    handleValidator(req, res, next);
  }
];

const validateUpdateClient = [
  // En actualización todos los campos son opcionales
  check('name')
    .optional()
    .isString().withMessage('El nombre debe ser una cadena de texto'),
  check('nif')
    .optional()
    .isString().withMessage('El NIF debe ser una cadena de texto'),
  check('email')
    .optional()
    .isEmail().withMessage('El email debe ser válido'),
  check('phone')
    .optional()
    .isString().withMessage('El teléfono debe ser una cadena de texto'),
  check('address')
    .optional()
    .isString().withMessage('La dirección debe ser una cadena de texto'),
  check('postalCode')
    .optional()
    .isString().withMessage('El código postal debe ser una cadena de texto'),
  check('city')
    .optional()
    .isString().withMessage('La ciudad debe ser una cadena de texto'),
  check('province')
    .optional()
    .isString().withMessage('La provincia debe ser una cadena de texto'),
  (req, res, next) => {
    handleValidator(req, res, next);
  }
];

module.exports = {
  validateCreateClient,
  validateUpdateClient
};