import { motion } from 'framer-motion';

const configs = {
  primary: {
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)',
    border: 'rgba(99,102,241,0.25)',
    glow: 'rgba(99,102,241,0.15)',
    icon: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.1))',
    text: '#818cf8',
    dot: '#6366f1',
  },
  purple: {
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
    border: 'rgba(168,85,247,0.25)',
    glow: 'rgba(168,85,247,0.15)',
    icon: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.1))',
    text: '#c084fc',
    dot: '#a855f7',
  },
  emerald: {
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
    border: 'rgba(16,185,129,0.25)',
    glow: 'rgba(16,185,129,0.12)',
    icon: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1))',
    text: '#34d399',
    dot: '#10b981',
  },
  amber: {
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
    border: 'rgba(245,158,11,0.25)',
    glow: 'rgba(245,158,11,0.12)',
    icon: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
  red: {
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
    border: 'rgba(239,68,68,0.25)',
    glow: 'rgba(239,68,68,0.12)',
    icon: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1))',
    text: '#f87171',
    dot: '#ef4444',
  },
  blue: {
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
    border: 'rgba(59,130,246,0.25)',
    glow: 'rgba(59,130,246,0.12)',
    icon: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))',
    text: '#60a5fa',
    dot: '#3b82f6',
  },
};

const StatCard = ({ label, value, icon, color = 'primary', delay = 0 }) => {
  const c = configs[color] || configs.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative rounded-2xl p-5 overflow-hidden shimmer cursor-default"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px ${c.glow}, 0 1px 0 rgba(255,255,255,0.05) inset`,
      }}
    >
      {/* Top-right glow dot */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
        style={{ background: c.dot, boxShadow: `0 0 8px ${c.dot}` }} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.15 }}
            className="text-3xl font-black text-white tabular-nums"
          >
            {value ?? <span className="text-slate-600">—</span>}
          </motion.p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.icon, color: c.text }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
