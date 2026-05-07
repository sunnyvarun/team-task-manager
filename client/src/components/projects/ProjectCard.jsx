import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

const avatarColors = [
  'bg-brand-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-accent-500',
  'bg-brand-700',
];

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberCount = project.member_ids ? project.member_ids.split(',').length : 0;
  const memberNames = project.member_names ? project.member_names.split(',') : [];

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="card-hover p-5 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0
                      group-hover:bg-brand-100 transition-colors">
          <span className="text-sm font-bold text-brand-600">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {user?.role === 'admin' && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" 
               onClick={e => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="p-1.5 text-surface-700 hover:text-surface-700 hover:bg-surface-100 
                         rounded-lg transition-colors"
              title="Edit project"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-surface-700 hover:text-danger-600 hover:bg-danger-50 
                         rounded-lg transition-colors"
              title="Delete project"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-sm font-semibold text-surface-900 mb-1 truncate group-hover:text-brand-600 transition-colors">
        {project.name}
      </h3>
      
      {project.description ? (
        <p className="text-xs text-surface-800 mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      ) : (
        <p className="text-xs text-surface-300 italic mb-4">No description</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-100">
        <div className="flex items-center gap-1.5 text-xs text-surface-700">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
        </div>

        {/* Member avatars */}
        {memberNames.length > 0 && (
          <div className="flex -space-x-1.5">
            {memberNames.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${avatarColors[index % avatarColors.length]} 
                          flex items-center justify-center text-white text-2xs font-semibold 
                          ring-2 ring-white`}
                title={name.trim()}
              >
                {name.trim().charAt(0).toUpperCase()}
              </div>
            ))}
            {memberCount > 3 && (
              <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center 
                            text-2xs font-medium text-surface-800 ring-2 ring-white">
                +{memberCount - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};