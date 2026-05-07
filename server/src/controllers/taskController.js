const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = catchAsync(async (req, res, next) => {
    const { title, description, projectId, assignedTo, status, dueDate } = req.body;

    // Check if project exists
    const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ?',
        [projectId]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    // Check if user is member of project (if member)
    if (req.user.role === 'member') {
        const [memberCheck] = await pool.execute(
            'SELECT * FROM project_members WHERE project_id = ? AND user_id = ?',
            [projectId, req.user.id]
        );

        if (memberCheck.length === 0) {
            return next(new AppError('You are not a member of this project', 403));
        }
    }

    // Insert task
    const [result] = await pool.execute(
        'INSERT INTO tasks (title, description, project_id, assigned_to, status, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description || '', projectId, assignedTo || null, status || 'todo', dueDate || null, req.user.id]
    );

    // Fetch created task with related data
    const [tasks] = await pool.execute(
        `SELECT t.*, 
         u.name as assigned_to_name, 
         u.email as assigned_to_email,
         creator.name as created_by_name
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         LEFT JOIN users creator ON t.created_by = creator.id
         WHERE t.id = ?`,
        [result.insertId]
    );

    res.status(201).json({
        status: 'success',
        data: {
            task: tasks[0]
        }
    });
});

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = catchAsync(async (req, res, next) => {
    let query = `
        SELECT t.*, 
        u.name as assigned_to_name, 
        u.email as assigned_to_email,
        creator.name as created_by_name,
        p.name as project_name
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN users creator ON t.created_by = creator.id
        LEFT JOIN projects p ON t.project_id = p.id
    `;

    let conditions = [];
    let params = [];

    // RBAC: Members see only their assigned tasks
    if (req.user.role === 'member') {
        conditions.push('t.assigned_to = ?');
        params.push(req.user.id);
    }

    // Filter by project
    if (req.query.projectId) {
        conditions.push('t.project_id = ?');
        params.push(req.query.projectId);
    }

    // Filter by status
    if (req.query.status) {
        conditions.push('t.status = ?');
        params.push(req.query.status);
    }

    // Filter overdue tasks
    if (req.query.overdue === 'true') {
        conditions.push('t.due_date < CURDATE() AND t.status != "completed"');
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Search by title
    if (req.query.search) {
        const searchCondition = conditions.length > 0 ? ' AND' : ' WHERE';
        query += `${searchCondition} t.title LIKE ?`;
        params.push(`%${req.query.search}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    const [tasks] = await pool.execute(query, params);

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: {
            tasks
        }
    });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = catchAsync(async (req, res, next) => {
    const [tasks] = await pool.execute(
        `SELECT t.*, 
         u.name as assigned_to_name, 
         u.email as assigned_to_email,
         creator.name as created_by_name,
         p.name as project_name
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         LEFT JOIN users creator ON t.created_by = creator.id
         LEFT JOIN projects p ON t.project_id = p.id
         WHERE t.id = ?`,
        [req.params.id]
    );

    if (tasks.length === 0) {
        return next(new AppError('No task found with that ID', 404));
    }

    // RBAC: Members can only view their assigned tasks
    if (req.user.role === 'member' && tasks[0].assigned_to !== req.user.id) {
        return next(new AppError('You do not have access to this task', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task: tasks[0]
        }
    });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = catchAsync(async (req, res, next) => {
    const { title, description, status, assignedTo, dueDate } = req.body;

    // Check if task exists
    const [tasks] = await pool.execute(
        'SELECT * FROM tasks WHERE id = ?',
        [req.params.id]
    );

    if (tasks.length === 0) {
        return next(new AppError('No task found with that ID', 404));
    }

    // RBAC: Members can only update their assigned tasks
    if (req.user.role === 'member' && tasks[0].assigned_to !== req.user.id) {
        return next(new AppError('You do not have permission to update this task', 403));
    }

    // Build update query
    const updates = [];
    const values = [];

    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (assignedTo !== undefined) {
        updates.push('assigned_to = ?');
        values.push(assignedTo);
    }
    if (dueDate !== undefined) {
        updates.push('due_date = ?');
        values.push(dueDate);
    }

    if (updates.length === 0) {
        return next(new AppError('No fields to update', 400));
    }

    values.push(req.params.id);

    await pool.execute(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
        values
    );

    // Fetch updated task
    const [updatedTasks] = await pool.execute(
        `SELECT t.*, 
         u.name as assigned_to_name, 
         u.email as assigned_to_email,
         creator.name as created_by_name,
         p.name as project_name
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         LEFT JOIN users creator ON t.created_by = creator.id
         LEFT JOIN projects p ON t.project_id = p.id
         WHERE t.id = ?`,
        [req.params.id]
    );

    res.status(200).json({
        status: 'success',
        data: {
            task: updatedTasks[0]
        }
    });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
const deleteTask = catchAsync(async (req, res, next) => {
    const [tasks] = await pool.execute(
        'SELECT * FROM tasks WHERE id = ?',
        [req.params.id]
    );

    if (tasks.length === 0) {
        return next(new AppError('No task found with that ID', 404));
    }

    await pool.execute(
        'DELETE FROM tasks WHERE id = ?',
        [req.params.id]
    );

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };