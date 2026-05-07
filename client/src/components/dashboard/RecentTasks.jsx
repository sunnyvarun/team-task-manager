import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { TASK_STATUS_LABELS } from '../../utils/constants';
import { formatDistanceToNow } from 'date-fns';

const statusIcons = {
  completed: (
    <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  in_progress: (
    <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  todo: (
    <svg className="w-4 h-4 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

export const RecentTasks = ({ tasks }) => {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-10 h-10 text-surface-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-surface-700">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          onClick={() => navigate(`/tasks/${task.id}`)}
          className="flex items-center gap-3 px-3 py-2.5 -mx-2 rounded-lg cursor-pointer
                     hover:bg-surface-50 transition-colors group animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Status icon */}
          <div className="shrink-0">
            {statusIcons[task.status] || statusIcons.todo}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-700 truncate group-hover:text-surface-900 transition-colors">
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-surface-700">{task.project_name}</span>
              {task.assigned_to_name && (
                <>
                  <span className="text-surface-300">·</span>
                  <span className="text-xs text-surface-700">{task.assigned_to_name}</span>
                </>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={task.status} size="sm">
              {TASK_STATUS_LABELS[task.status]}
            </Badge>
            <span className="text-xs text-surface-700 w-20 text-right">
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};