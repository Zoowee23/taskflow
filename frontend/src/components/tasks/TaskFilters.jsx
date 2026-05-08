import { useState } from 'react';

const TaskFilters = ({ filters, onChange }) => {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    onChange({ search, page: 1 });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
      </form>

      {/* Status filter */}
      <select
        className="input-field py-2 text-sm w-auto min-w-[130px]"
        value={filters.status || ''}
        onChange={(e) => onChange({ status: e.target.value || undefined, page: 1 })}
      >
        <option value="" className="bg-dark-600">All Status</option>
        <option value="todo" className="bg-dark-600">To Do</option>
        <option value="in_progress" className="bg-dark-600">In Progress</option>
        <option value="completed" className="bg-dark-600">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        className="input-field py-2 text-sm w-auto min-w-[130px]"
        value={filters.priority || ''}
        onChange={(e) => onChange({ priority: e.target.value || undefined, page: 1 })}
      >
        <option value="" className="bg-dark-600">All Priority</option>
        <option value="high" className="bg-dark-600">High</option>
        <option value="medium" className="bg-dark-600">Medium</option>
        <option value="low" className="bg-dark-600">Low</option>
      </select>

      {/* Sort */}
      <select
        className="input-field py-2 text-sm w-auto min-w-[130px]"
        value={`${filters.sortBy || 'createdAt'}_${filters.order || 'DESC'}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split('_');
          onChange({ sortBy, order, page: 1 });
        }}
      >
        <option value="createdAt_DESC" className="bg-dark-600">Newest First</option>
        <option value="createdAt_ASC" className="bg-dark-600">Oldest First</option>
        <option value="dueDate_ASC" className="bg-dark-600">Due Date ↑</option>
        <option value="dueDate_DESC" className="bg-dark-600">Due Date ↓</option>
        <option value="priority_DESC" className="bg-dark-600">Priority ↓</option>
      </select>

      {/* Clear filters */}
      {(filters.status || filters.priority || filters.search) && (
        <button
          onClick={() => { setSearch(''); onChange({ status: undefined, priority: undefined, search: undefined, page: 1 }); }}
          className="btn-ghost py-2 text-sm text-red-400 hover:text-red-300"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
