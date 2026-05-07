const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = catchAsync(async (req, res, next) => {
    let params = [];
    let additionalCondition = '';

    // RBAC: Members see only their stats
    if (req.user.role === 'member') {
        additionalCondition = 'WHERE assigned_to = ?';
        params.push(req.user.id);
    }

    // Get total tasks
    const [totalTasks] = await pool.execute(
        `SELECT COUNT(*) as total FROM tasks ${additionalCondition}`,
        params
    );

    // Get completed tasks
    const [completedTasks] = await pool.execute(
        `SELECT COUNT(*) as completed FROM tasks ${additionalCondition ? additionalCondition + ' AND' : 'WHERE'} status = 'completed'`,
        params
    );

    // Get pending tasks (todo + in_progress)
    const [pendingTasks] = await pool.execute(
        `SELECT COUNT(*) as pending FROM tasks ${additionalCondition ? additionalCondition + ' AND' : 'WHERE'} status != 'completed'`,
        params
    );

    // Get overdue tasks (due_date < today and not completed)
    const [overdueTasks] = await pool.execute(
        `SELECT COUNT(*) as overdue FROM tasks ${additionalCondition ? additionalCondition + ' AND' : 'WHERE'} due_date < CURDATE() AND status != 'completed'`,
        params
    );

    // Get tasks by status
    const [tasksByStatus] = await pool.execute(
        `SELECT status, COUNT(*) as count FROM tasks ${additionalCondition} GROUP BY status`,
        params
    );

    // Get tasks by project
    let projectQuery = `
        SELECT p.id, p.name, COUNT(t.id) as task_count
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
    `;

    if (req.user.role === 'member') {
        projectQuery += `
            INNER JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = ?
        `;
        const [tasksByProject] = await pool.execute(
            projectQuery + ' GROUP BY p.id, p.name',
            [req.user.id]
        );

        return res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    total: totalTasks[0].total,
                    completed: completedTasks[0].completed,
                    pending: pendingTasks[0].pending,
                    overdue: overdueTasks[0].overdue
                },
                tasksByStatus,
                tasksByProject
            }
        });
    }

    const [tasksByProject] = await pool.execute(
        projectQuery + ' GROUP BY p.id, p.name'
    );

    // Get recent tasks
    const [recentTasks] = await pool.execute(
        `SELECT t.*, u.name as assigned_to_name, p.name as project_name
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         LEFT JOIN projects p ON t.project_id = p.id
         ${additionalCondition}
         ORDER BY t.created_at DESC
         LIMIT 5`,
        params
    );

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                total: totalTasks[0].total,
                completed: completedTasks[0].completed,
                pending: pendingTasks[0].pending,
                overdue: overdueTasks[0].overdue
            },
            tasksByStatus,
            tasksByProject,
            recentTasks
        }
    });
});

module.exports = { getDashboardStats };