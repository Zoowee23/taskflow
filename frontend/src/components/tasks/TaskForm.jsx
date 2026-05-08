import { useState } from 'react';
import { TASK_PRIORITY, TASK_STATUS } from '../../utils/constants';

const TaskForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    priority: initial.priority || 'medium',
    status: initial.status || 'todo',
    dueDate: initial.dueDate || '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    if (!payload.description) delete payload.description;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
        <input className="input-field" placeholder="Task title" value={form.title} onChange={set('title')} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
        <textarea className="input-field resize-none" rows={3} placeholder="Optional description..." value={form.description} onChange={set('description')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
          <select className="input-field" value={form.priority} onChange={set('priority')}>
            {Object.values(TASK_PRIORITY).map((p) => (
              <option key={p} value={p} className="bg-dark-600 capitalize">{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select className="input-field" value={form.status} onChange={set('status')}>
            <option value="todo" className="bg-dark-600">To Do</option>
            <option value="in_progress" className="bg-dark-600">In Progress</option>
            <option value="completed" className="bg-dark-600">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
        <input type="date" className="input-field" value={form.dueDate} onChange={set('dueDate')} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : initial.id ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
      </div>
    </form>
  );
};

export default TaskForm;
