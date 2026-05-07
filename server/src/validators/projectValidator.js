const { body } = require('express-validator');

const createProjectValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name must be between 2 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    
    body('teamMembers')
        .optional()
        .isArray()
        .withMessage('Team members must be an array of user IDs')
];

const updateProjectValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name must be between 2 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters')
];

module.exports = { createProjectValidator, updateProjectValidator };