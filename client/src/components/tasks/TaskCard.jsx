import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { formatDate, isOverdue } from '../../utils/helpers';
import { TASK_STATUS_LABELS } from '../../utils/constants';

const nextStatus = {
  todo: 'in_progress',
  in_progress: 'completed',
  completed: 'todo'
};

const borderColors = {
  todo: 'border-l-warning-500',
  in_progress: 'border-l-brand-500',
  completed: 'border-l-success-500',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();
  const isTaskOverdue = isOverdue(task.due_date) && task.status !== 'completed';

  return (
    <div className={`card p-4 group cursor-pointer border-l-[3px] transition-all duration-200
      ${borderColors[task.status] || borderColors.todo}
      ${isTaskOverdue ? 'ring-1 ring-danger-300 border-danger-300' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
            {task.title}
          </h4>
          {task.project_name && (
            <p className="text-xs text-surface-700 mt-0.5">{task.project_name}</p>
          )}
        </div>
        
        {/* Action buttons */}
        {(user?.role === 'admin' || task.assigned_to === user?.id) && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="p-1 text-surface-700 hover:text-surface-600 hover:bg-surface-100 rounded transition-colors"
              title="Edit task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-1 text-surface-700 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors"
                title="Delete task"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {task.description ? (
        <p className="text-xs text-surface-800 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      ) : (
        <p className="text-xs text-surface-300 italic mb-3">No description</p>
      )}

      {/* Status badges */}
      <div className="flex items-center gap-1.5 mb-3">
        <Badge variant={task.status} size="sm">
          {TASK_STATUS_LABELS[task.status]}
        </Badge>
        {isTaskOverdue && (
          <Badge variant="overdue" size="sm">
            Overdue
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
        <div className="flex items-center gap-1.5 min-w-0">
          {task.assigned_to_name ? (
            <>
              <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-white text-2xs font-semibold shrink-0">
                {task.assigned_to_name.charAt(0)}
              </div>
              <span className="text-xs text-surface-800 truncate">{task.assigned_to_name}</span>
            </>
          ) : (
            <span className="text-xs text-surface-700">Unassigned</span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {task.due_date && (
            <>
              <svg className={`w-3.5 h-3.5 ${isTaskOverdue ? 'text-danger-500' : 'text-surface-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`text-xs ${isTaskOverdue ? 'text-danger-600 font-medium' : 'text-surface-700'}`}>
                {formatDate(task.due_date)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quick status change */}
      <button
        onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, nextStatus[task.status]); }}
        className="w-full mt-3 pt-3 border-t border-surface-100 text-xs font-medium text-surface-700 
                   hover:text-brand-600 transition-colors text-left"
      >
        Move to {TASK_STATUS_LABELS[nextStatus[task.status]]}
      </button>
    </div>
  );
};