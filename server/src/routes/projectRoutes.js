const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { createProjectValidator, updateProjectValidator } = require('../validators/projectValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication
router.use(protect);

// Routes for all authenticated users
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);

// Admin only routes
router.post('/', authorize('admin'), createProjectValidator, validate, projectController.createProject);
router.put('/:id', authorize('admin'), updateProjectValidator, validate, projectController.updateProject);
router.delete('/:id', authorize('admin'), projectController.deleteProject);

// Member management (Admin only)
router.post('/:id/members', authorize('admin'), projectController.addMember);
router.delete('/:id/members/:userId', authorize('admin'), projectController.removeMember);

module.exports = router;