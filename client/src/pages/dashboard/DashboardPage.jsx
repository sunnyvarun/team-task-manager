import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { Skeleton } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5 space-y-3">
            <Skeleton className="h-4 w-24 mb-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <div className="card p-5 space-y-3">
            <Skeleton className="h-4 w-24 mb-2" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completionRate = stats?.stats.total > 0 
    ? Math.round((stats.stats.completed / stats.stats.total) * 100) 
    : 0;

  const statCards = [
    { 
      title: 'Total Tasks', 
      value: stats?.stats.total || 0, 
      variant: 'brand',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      title: 'Completed', 
      value: stats?.stats.completed || 0, 
      variant: 'success',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: 'Pending', 
      value: stats?.stats.pending || 0, 
      variant: 'warning',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: 'Overdue', 
      value: stats?.stats.overdue || 0, 
      variant: stats?.stats.overdue > 0 ? 'danger' : 'neutral',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-sm text-surface-800 mt-1">Overview of your projects and tasks</p>
        </div>
        {stats?.stats.total > 0 && (
          <div className="flex items-center gap-3 bg-white rounded-xl border border-surface-200 px-4 py-3 self-start">
            <div className="text-right">
              <p className="text-2xl font-bold text-surface-900 leading-none">{completionRate}%</p>
              <p className="text-xs text-surface-800 mt-0.5">completion rate</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-success-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Status & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-5">Task Status</h3>
          {stats?.tasksByStatus && stats.tasksByStatus.length > 0 ? (
            <div className="space-y-4">
              {stats.tasksByStatus.map((status) => {
                const percentage = stats.stats.total > 0 
                  ? (status.count / stats.stats.total) * 100 
                  : 0;
                
                const config = {
                  todo: { bar: 'bg-surface-400', text: 'text-surface-600' },
                  in_progress: { bar: 'bg-brand-500', text: 'text-brand-600' },
                  completed: { bar: 'bg-success-500', text: 'text-success-600' },
                };
                const { bar, text } = config[status.status] || config.todo;
                
                return (
                  <div key={status.status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-surface-700 capitalize">
                        {status.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-surface-800">{status.count}</span>
                    </div>
                    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-surface-700 text-center py-8">No tasks yet</p>
          )}
        </div>

        {/* Project Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-5">By Project</h3>
          {stats?.tasksByProject && stats.tasksByProject.length > 0 ? (
            <div className="space-y-3">
              {stats.tasksByProject.slice(0, 5).map((project) => {
                const maxTasks = Math.max(...stats.tasksByProject.map(p => p.task_count), 1);
                const width = (project.task_count / maxTasks) * 100;
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block group"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-surface-700 group-hover:text-surface-900 truncate transition-colors">
                        {project.name}
                      </span>
                      <span className="text-xs text-surface-800 ml-2 shrink-0">{project.task_count}</span>
                    </div>
                    <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500 rounded-full transition-all duration-700 ease-out group-hover:bg-brand-600"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-surface-700 text-center py-8">No projects yet</p>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">Recent Tasks</h3>
          <Link to="/tasks" className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
            View all
          </Link>
        </div>
        {stats?.recentTasks && stats.recentTasks.length > 0 ? (
          <div className="divide-y divide-surface-100 -mx-2">
            {stats.recentTasks.slice(0, 5).map(task => (
              <Link
                key={task.id}
                to="/tasks"
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-surface-50 transition-colors group"
              >
                <Badge variant={task.status} size="sm">
                  {task.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-surface-700 flex-1 truncate group-hover:text-surface-900 transition-colors">
                  {task.title}
                </span>
                <span className="text-xs text-surface-700 shrink-0">{task.project_name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-700 text-center py-6">No recent tasks</p>
        )}
      </div>
    </div>
  );
};