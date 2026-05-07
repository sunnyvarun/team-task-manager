const { body } = require('express-validator');

const createTaskValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Task title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Task title must be between 2 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    
    body('projectId')
        .notEmpty()
        .withMessage('Project ID is required')
        .isInt()
        .withMessage('Project ID must be a number'),
    
    body('assignedTo')
        .optional()
        .isInt()
        .withMessage('Assigned user ID must be a number'),
    
    body('status')
        .optional()
        .isIn(['todo', 'in_progress', 'completed'])
        .withMessage('Status must be todo, in_progress, or completed'),
    
    body('dueDate')
        .optional()
        .isDate()
        .withMessage('Please provide a valid date')
];

const updateTaskValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Task title must be between 2 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    
    body('status')
        .optional()
        .isIn(['todo', 'in_progress', 'completed'])
        .withMessage('Status must be todo, in_progress, or completed'),
    
    body('assignedTo')
        .optional()
        .isInt()
        .withMessage('Assigned user ID must be a number'),
    
    body('dueDate')
        .optional()
        .isDate()
        .withMessage('Please provide a valid date')
];

module.exports = { createTaskValidator, updateTaskValidator };