import { useNavigate } from 'react-router-dom';

export const ProjectOverview = ({ projects }) => {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-surface-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-surface-700">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {projects.slice(0, 5).map((project, index) => (
        <div
          key={project.id}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="flex items-center justify-between px-3 py-2.5 -mx-2 rounded-lg cursor-pointer
                     hover:bg-surface-50 transition-colors group animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 
                          group-hover:bg-brand-100 transition-colors">
              <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-700 truncate group-hover:text-surface-900 transition-colors">
                {project.name}
              </p>
              <p className="text-xs text-surface-700 mt-0.5">
                {project.member_count || 0} member{project.member_count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-sm font-semibold text-surface-700 group-hover:text-surface-900 transition-colors">
              {project.task_count || 0}
            </p>
            <p className="text-xs text-surface-700">tasks</p>
          </div>
        </div>
      ))}
    </div>
  );
};