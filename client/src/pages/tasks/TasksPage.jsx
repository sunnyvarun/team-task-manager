import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilters } from '../../components/tasks/TaskFilters';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    search: '',
    projectId: '',
    status: '',
    overdue: false
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async (filterParams = {}) => {
    try {
      const params = { ...filters, ...filterParams };
      Object.keys(params).forEach(key => {
        if (!params[key] && params[key] !== false) delete params[key];
      });
      
      const data = await taskService.getTasks(params);
      setTasks(data.data.tasks || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data.data.projects || []);
    } catch (error) {
      // Silent fail - projects filter just won't populate
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setLoading(true);
    fetchTasks(newFilters);
  };

  const handleCreate = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created');
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      throw error;
    }
  };

  const handleUpdate = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      toast.success('Task updated');
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const activeFilterCount = [filters.search, filters.projectId, filters.status, filters.overdue]
    .filter(Boolean).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Tasks</h1>
          <p className="text-sm text-surface-800 mt-1">
            {loading 
              ? 'Loading...' 
              : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}${activeFilterCount > 0 ? ' found' : ''}`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-surface-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-surface-900' 
                  : 'text-surface-700 hover:text-surface-600'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                viewMode === 'board' 
                  ? 'bg-white shadow-sm text-surface-900' 
                  : 'text-surface-700 hover:text-surface-600'
              }`}
              title="Board view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <Button onClick={() => setShowForm(true)} size="md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        projects={projects}
        onChange={handleFilterChange}
      />

      {/* Content */}
      {loading ? (
        <div className={viewMode === 'board' 
          ? 'grid grid-cols-1 md:grid-cols-3 gap-5'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        }>
          {[...Array(viewMode === 'board' ? 3 : 6)].map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton lines={2} />
              <div className="pt-3 border-t border-surface-100 flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          viewMode={viewMode}
          onEdit={setEditTask}
          onDelete={handleDelete}
          onStatusChange={(id, status) => handleUpdate(id, { status })}
        />
      )}

      {/* Form Modal */}
      {(showForm || editTask) && (
        <TaskForm
          task={editTask}
          projects={projects}
          onSubmit={editTask 
            ? (data) => handleUpdate(editTask.id, data) 
            : handleCreate
          }
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
};