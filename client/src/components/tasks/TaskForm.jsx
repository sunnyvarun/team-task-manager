import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export const TaskForm = ({ task, projects, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    status: 'todo',
    dueDate: ''
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id || '',
        assignedTo: task.assigned_to || '',
        status: task.status || 'todo',
        dueDate: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
    fetchUsers();
  }, [task]);

  const fetchUsers = async () => {
    try {
      const data = await authService.getUsers();
      setUsers(data.data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.projectId) newErrors.projectId = 'Select a project';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        projectId: Number(formData.projectId),
        assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
      });
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={task ? 'Edit task' : 'New task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={errors.title}
          placeholder="What needs to be done?"
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
            Project
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => updateField('projectId', e.target.value)}
            className="select-field"
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          {errors.projectId && (
            <p className="text-xs text-danger-600 mt-1">{errors.projectId}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="textarea-field"
            placeholder="Add details (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
              Assign to
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => updateField('assignedTo', e.target.value)}
              className="select-field"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="select-field"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
            Due date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <Button type="submit" isLoading={loading} className="flex-1">
            {task ? 'Save changes' : 'Create task'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};