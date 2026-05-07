import { SearchBar } from '../common/SearchBar';

export const TaskFilters = ({ filters, projects, onChange }) => {
  const hasActiveFilters = filters.search || filters.projectId || filters.status || filters.overdue;

  const clearFilters = () => {
    onChange('search', '');
    onChange('projectId', '');
    onChange('status', '');
    onChange('overdue', false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchBar
        value={filters.search}
        onChange={(value) => onChange('search', value)}
        placeholder="Search tasks..."
        className="sm:w-64"
      />

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={filters.projectId}
          onChange={(e) => onChange('projectId', e.target.value)}
          className="select-field w-40 text-sm"
        >
          <option value="">All projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="select-field w-36 text-sm"
        >
          <option value="">All status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 text-sm select-none
          ${filters.overdue 
            ? 'bg-danger-50 border-danger-300 text-danger-700' 
            : 'bg-white border-surface-200 text-surface-800 hover:border-surface-300'
          }`}>
          <input
            type="checkbox"
            checked={filters.overdue}
            onChange={(e) => onChange('overdue', e.target.checked)}
            className="w-3.5 h-3.5 rounded border-surface-300 text-danger-600 
                     focus:ring-danger-500 focus:ring-offset-0 cursor-pointer"
          />
          Overdue
        </label>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-surface-700 hover:text-surface-600 transition-colors px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};