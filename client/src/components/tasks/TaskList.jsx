import { TaskCard } from './TaskCard';

const columns = ['todo', 'in_progress', 'completed'];

const columnConfig = {
  todo: { 
    title: 'To Do', 
    color: 'bg-warning-500',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
      </svg>
    )
  },
  in_progress: { 
    title: 'In Progress', 
    color: 'bg-brand-500',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  completed: { 
    title: 'Completed', 
    color: 'bg-success-500',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
};

export const TaskList = ({ tasks, viewMode, onEdit, onDelete, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-surface-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-surface-700 mb-1">No tasks found</h3>
        <p className="text-xs text-surface-700">Try adjusting your filters or create a new task</p>
      </div>
    );
  }

  if (viewMode === 'board') {
    const grouped = {
      todo: tasks.filter(t => t.status === 'todo'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      completed: tasks.filter(t => t.status === 'completed'),
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map(status => {
          const columnTasks = grouped[status];
          const config = columnConfig[status];
          
          return (
            <div key={status} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  <h3 className="text-sm font-semibold text-surface-700">{config.title}</h3>
                </div>
                <span className="text-xs font-medium text-surface-700 bg-surface-100 px-2 py-0.5 rounded-md">
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Tasks */}
              <div className="space-y-2 min-h-[120px]">
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-surface-200 rounded-xl">
                    <p className="text-xs text-surface-300">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // List view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-fade-in">
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </div>
      ))}
    </div>
  );
};