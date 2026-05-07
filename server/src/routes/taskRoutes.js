const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication
router.use(protect);

// Routes for all authenticated users
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);

// Admin only routes
router.delete('/:id', authorize('admin'), taskController.deleteTask);

module.exports = router;