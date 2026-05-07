import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export const ProjectForm = ({ project, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamMembers: []
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        teamMembers: project.member_ids ? project.member_ids.split(',').map(Number) : []
      });
    }
    fetchUsers();
  }, [project]);

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
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId]
    }));
  };

  const selectedCount = formData.teamMembers.length;

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={project ? 'Edit project' : 'New project'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          placeholder="Enter project name"
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="textarea-field"
            placeholder="Describe the project"
          />
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
              Team members
            </label>
            {selectedCount > 0 && (
              <span className="text-xs text-surface-700">
                {selectedCount} selected
              </span>
            )}
          </div>
          
          <div className="max-h-52 overflow-y-auto space-y-1 border border-surface-200 rounded-lg p-1">
            {users.length === 0 ? (
              <p className="text-sm text-surface-700 text-center py-6">No users available</p>
            ) : (
              users.map(user => {
                const isSelected = formData.teamMembers.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all duration-100
                      ${isSelected 
                        ? 'bg-brand-50 border border-brand-200' 
                        : 'hover:bg-surface-50 border border-transparent'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMember(user.id)}
                      className="w-4 h-4 rounded border-surface-300 text-brand-600 
                               focus:ring-brand-500 focus:ring-offset-0 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-700 truncate">{user.name}</p>
                        <p className="text-xs text-surface-700 truncate">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'admin' : 'member'} size="sm">
                        {user.role}
                      </Badge>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <Button type="submit" isLoading={loading} className="flex-1">
            {project ? 'Save changes' : 'Create project'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};