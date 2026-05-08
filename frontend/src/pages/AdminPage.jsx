import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../services/adminService';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  );

  const ts = stats?.taskStats || {};

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide overview</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={<IconUsers />} color="purple" delay={0} />
        <StatCard label="Total Tasks" value={stats?.totalTasks} icon={<IconTasks />} color="primary" delay={0.05} />
        <StatCard label="Completed" value={ts.completed} icon={<IconCheck />} color="emerald" delay={0.1} />
        <StatCard label="In Progress" value={ts.in_progress} icon={<IconProgress />} color="blue" delay={0.15} />
      </div>

      {/* Task breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Task Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'To Do', value: ts.todo, color: 'bg-slate-500', total: stats?.totalTasks },
              { label: 'In Progress', value: ts.in_progress, color: 'bg-blue-500', total: stats?.totalTasks },
              { label: 'Completed', value: ts.completed, color: 'bg-emerald-500', total: stats?.totalTasks },
            ].map(({ label, value, color, total }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-slate-400">{value ?? 0} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Priority breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Priority Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'High', value: ts.high, color: 'bg-red-500', total: stats?.totalTasks },
              { label: 'Medium', value: ts.medium, color: 'bg-amber-500', total: stats?.totalTasks },
              { label: 'Low', value: ts.low, color: 'bg-emerald-500', total: stats?.totalTasks },
            ].map(({ label, value, color, total }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-slate-400">{value ?? 0} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

const IconUsers = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconTasks = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconProgress = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default AdminPage;
