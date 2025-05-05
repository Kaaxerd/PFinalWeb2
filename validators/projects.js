const { check } = require('express-validator');

const validateCreateProject = [
  check('name').notEmpty(),
  check('client').notEmpty().isMongoId(),
];

const validateUpdateProject = [
  check('status').optional().isIn(['pending','in-progress','completed']),
  check('description').optional().notEmpty(),
];

module.exports = { validateCreateProject, validateUpdateProject };