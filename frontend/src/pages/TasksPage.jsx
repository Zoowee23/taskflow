import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useTasks } from '../hooks/useTasks';

const TasksPage = () => {
  const { tasks, meta, loading, filters, setFilters, createTask, updateTask, deleteTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters((f) => ({ ...f, ...newFilters }));
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editTask) {
        await updateTask(editTask.id, data);
      } else {
        await createTask(data);
      }
      setModalOpen(false);
      setEditTask(null);
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          {meta && <p className="text-slate-400 text-sm mt-1">{meta.total} task{meta.total !== 1 ? 's' : ''} total</p>}
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-6">
        <TaskFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tasks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-300 font-medium mb-1">No tasks found</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters or create a new task</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} onEdit={openEdit} onDelete={deleteTask} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-slate-400 text-sm px-4">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={filters.page >= meta.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editTask ? 'Edit Task' : 'Create New Task'}>
        <TaskForm initial={editTask || {}} onSubmit={handleSubmit} onCancel={closeModal} loading={formLoading} />
      </Modal>
    </DashboardLayout>
  );
};

export default TasksPage;
