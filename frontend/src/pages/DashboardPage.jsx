import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { adminService } from '../services/adminService';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { tasks, loading, createTask, deleteTask } = useTasks({ limit: 6 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = isAdmin
          ? await adminService.getDashboard()
          : await taskService.getStats();
        setStats(res.data.data);
      } catch { /* non-critical */ }
      finally { setStatsLoading(false); }
    };
    fetchStats();
  }, [isAdmin]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try { await createTask(data); setModalOpen(false); }
    finally { setFormLoading(false); }
  };

  const ts = isAdmin ? stats?.taskStats : stats;
  const totalTasks = ts
    ? (parseInt(ts.todo || 0) + parseInt(ts.in_progress || 0) + parseInt(ts.completed || 0))
    : null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <DashboardLayout>
      {/* Hero header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-slate-500 text-sm font-medium mb-1"
          >
            {greeting} 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl font-black text-white"
          >
            {user?.name?.split(' ')[0]}'s Workspace
          </motion.h1>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </motion.button>
      </div>

      {/* Stats grid */}
      <div className={`grid gap-4 mb-8 ${isAdmin ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {isAdmin && (
          <StatCard label="Total Users" value={stats?.totalUsers} icon={<IconUsers />} color="purple" delay={0} />
        )}
        <StatCard label="Total Tasks" value={isAdmin ? stats?.totalTasks : totalTasks} icon={<IconTasks />} color="primary" delay={0.05} />
        <StatCard label="To Do" value={ts?.todo} icon={<IconCircle />} color="amber" delay={0.1} />
        <StatCard label="In Progress" value={ts?.in_progress} icon={<IconProgress />} color="blue" delay={0.15} />
        <StatCard label="Completed" value={ts?.completed} icon={<IconCheck />} color="emerald" delay={0.2} />
      </div>

      {/* Recent tasks section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Recent Tasks</h2>
          <p className="text-xs text-slate-600 mt-0.5">Your latest activity</p>
        </div>
        <Link
          to="/tasks"
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: '#818cf8' }}
          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
          onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-14 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <svg className="w-8 h-8" style={{ color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold mb-1">No tasks yet</p>
          <p className="text-slate-600 text-sm mb-5">Create your first task to get started</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            Create your first task
          </button>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} onDelete={deleteTask} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={formLoading} />
      </Modal>
    </DashboardLayout>
  );
};

const IconUsers = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconTasks = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const IconCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /></svg>;
const IconProgress = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default DashboardPage;
