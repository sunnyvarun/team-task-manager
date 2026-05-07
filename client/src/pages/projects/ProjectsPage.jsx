import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data.data.projects || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (projectData) => {
    try {
      await projectService.createProject(projectData);
      toast.success('Project created');
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
      throw error;
    }
  };

  const handleUpdate = async (id, projectData) => {
    try {
      await projectService.updateProject(id, projectData);
      toast.success('Project updated');
      setEditProject(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return;
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(search.toLowerCase()) ||
    project.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
          <p className="text-sm text-surface-800 mt-1">
            {loading ? 'Loading...' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar 
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
            className="w-64"
          />
          {user?.role === 'admin' && (
            <Button onClick={() => setShowForm(true)} size="md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton lines={2} />
              <div className="pt-4 border-t border-surface-100">
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
              <ProjectCard
                project={project}
                onEdit={() => setEditProject(project)}
                onDelete={() => handleDelete(project.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-surface-700 mb-1">
            {search ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-sm text-surface-700 mb-6">
            {search ? 'Try adjusting your search terms' : 'Create your first project to get started'}
          </p>
          {user?.role === 'admin' && !search && (
            <Button onClick={() => setShowForm(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create project
            </Button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {(showForm || editProject) && (
        <ProjectForm
          project={editProject}
          onSubmit={editProject 
            ? (data) => handleUpdate(editProject.id, data) 
            : handleCreate
          }
          onClose={() => {
            setShowForm(false);
            setEditProject(null);
          }}
        />
      )}
    </div>
  );
};