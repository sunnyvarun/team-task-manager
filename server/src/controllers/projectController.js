const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = catchAsync(async (req, res, next) => {
    const { name, description, teamMembers } = req.body;

    // Get connection for transaction
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Create project
        const [projectResult] = await connection.execute(
            'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
            [name, description || '', req.user.id]
        );

        const projectId = projectResult.insertId;

        // Add creator as team member
        await connection.execute(
            'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)',
            [projectId, req.user.id]
        );

        // Add additional team members if provided
        if (teamMembers && teamMembers.length > 0) {
            const memberValues = teamMembers.map(userId => [projectId, userId]);
            await connection.query(
                'INSERT INTO project_members (project_id, user_id) VALUES ?',
                [memberValues]
            );
        }

        await connection.commit();

        // Fetch created project with members
        const [projects] = await pool.execute(
            `SELECT p.*, 
             GROUP_CONCAT(DISTINCT u.id) as member_ids,
             GROUP_CONCAT(DISTINCT u.name) as member_names,
             GROUP_CONCAT(DISTINCT u.email) as member_emails
             FROM projects p
             LEFT JOIN project_members pm ON p.id = pm.project_id
             LEFT JOIN users u ON pm.user_id = u.id
             WHERE p.id = ?
             GROUP BY p.id`,
            [projectId]
        );

        res.status(201).json({
            status: 'success',
            data: {
                project: projects[0]
            }
        });
    } catch (error) {
        await connection.rollback();
        return next(error);
    } finally {
        connection.release();
    }
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = catchAsync(async (req, res, next) => {
    let query;
    let params = [];

    if (req.user.role === 'admin') {
        // Admin sees all projects
        query = `
            SELECT p.*, 
            GROUP_CONCAT(DISTINCT u.id) as member_ids,
            GROUP_CONCAT(DISTINCT u.name) as member_names,
            GROUP_CONCAT(DISTINCT u.email) as member_emails
            FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            LEFT JOIN users u ON pm.user_id = u.id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
    } else {
        // Members see only their projects
        query = `
            SELECT p.*, 
            GROUP_CONCAT(DISTINCT u.id) as member_ids,
            GROUP_CONCAT(DISTINCT u.name) as member_names,
            GROUP_CONCAT(DISTINCT u.email) as member_emails
            FROM projects p
            INNER JOIN project_members pm ON p.id = pm.project_id
            LEFT JOIN users u ON pm.user_id = u.id
            WHERE pm.user_id = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        params = [req.user.id];
    }

    const [projects] = await pool.execute(query, params);

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = catchAsync(async (req, res, next) => {
    const [projects] = await pool.execute(
        `SELECT p.*, 
         GROUP_CONCAT(DISTINCT u.id) as member_ids,
         GROUP_CONCAT(DISTINCT u.name) as member_names,
         GROUP_CONCAT(DISTINCT u.email) as member_emails
         FROM projects p
         LEFT JOIN project_members pm ON p.id = pm.project_id
         LEFT JOIN users u ON pm.user_id = u.id
         WHERE p.id = ?
         GROUP BY p.id`,
        [req.params.id]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    // Check if member has access
    if (req.user.role === 'member') {
        const [memberCheck] = await pool.execute(
            'SELECT * FROM project_members WHERE project_id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (memberCheck.length === 0) {
            return next(new AppError('You do not have access to this project', 403));
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            project: projects[0]
        }
    });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
const updateProject = catchAsync(async (req, res, next) => {
    const { name, description, teamMembers } = req.body;

    // Check if project exists
    const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ?',
        [req.params.id]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Update project details
        if (name || description) {
            const updates = [];
            const values = [];

            if (name) {
                updates.push('name = ?');
                values.push(name);
            }
            if (description !== undefined) {
                updates.push('description = ?');
                values.push(description);
            }

            values.push(req.params.id);

            await connection.execute(
                `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }

        // Update team members if provided
        if (teamMembers) {
            // Remove existing members except creator
            await connection.execute(
                'DELETE FROM project_members WHERE project_id = ? AND user_id != ?',
                [req.params.id, projects[0].created_by]
            );

            // Add new members
            if (teamMembers.length > 0) {
                const memberValues = teamMembers.map(userId => [req.params.id, userId]);
                await connection.query(
                    'INSERT IGNORE INTO project_members (project_id, user_id) VALUES ?',
                    [memberValues]
                );
            }
        }

        await connection.commit();

        // Fetch updated project
        const [updatedProjects] = await pool.execute(
            `SELECT p.*, 
             GROUP_CONCAT(DISTINCT u.id) as member_ids,
             GROUP_CONCAT(DISTINCT u.name) as member_names,
             GROUP_CONCAT(DISTINCT u.email) as member_emails
             FROM projects p
             LEFT JOIN project_members pm ON p.id = pm.project_id
             LEFT JOIN users u ON pm.user_id = u.id
             WHERE p.id = ?
             GROUP BY p.id`,
            [req.params.id]
        );

        res.status(200).json({
            status: 'success',
            data: {
                project: updatedProjects[0]
            }
        });
    } catch (error) {
        await connection.rollback();
        return next(error);
    } finally {
        connection.release();
    }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = catchAsync(async (req, res, next) => {
    const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ?',
        [req.params.id]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    await pool.execute(
        'DELETE FROM projects WHERE id = ?',
        [req.params.id]
    );

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
const addMember = catchAsync(async (req, res, next) => {
    const { userId } = req.body;

    // Check if project exists
    const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ?',
        [req.params.id]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    // Check if user exists
    const [users] = await pool.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
    );

    if (users.length === 0) {
        return next(new AppError('No user found with that ID', 404));
    }

    // Add member
    try {
        await pool.execute(
            'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)',
            [req.params.id, userId]
        );
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return next(new AppError('User is already a member of this project', 400));
        }
        throw error;
    }

    res.status(200).json({
        status: 'success',
        message: 'Member added successfully'
    });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
const removeMember = catchAsync(async (req, res, next) => {
    const { id, userId } = req.params;

    // Cannot remove project creator
    const [projects] = await pool.execute(
        'SELECT created_by FROM projects WHERE id = ?',
        [id]
    );

    if (projects.length === 0) {
        return next(new AppError('No project found with that ID', 404));
    }

    if (projects[0].created_by === parseInt(userId)) {
        return next(new AppError('Cannot remove project creator from project', 400));
    }

    const [result] = await pool.execute(
        'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
        [id, userId]
    );

    if (result.affectedRows === 0) {
        return next(new AppError('Member not found in this project', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Member removed successfully'
    });
});

module.exports = { 
    createProject, 
    getProjects, 
    getProject, 
    updateProject, 
    deleteProject,
    addMember,
    removeMember
};