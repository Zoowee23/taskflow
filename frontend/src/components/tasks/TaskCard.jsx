import { motion } from 'framer-motion';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const priorityDot = { high: '#f87171', medium: '#fbbf24', low: '#34d399' };
const priorityGlow = { high: 'rgba(239,68,68,0.15)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(16,185,129,0.12)' };

const TaskCard = ({ task, onEdit, onDelete, index = 0 }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isDone = task.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      className="relative rounded-2xl p-5 group transition-all duration-200 overflow-hidden"
      style={{
        background: isDone
          ? 'rgba(255,255,255,0.02)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: isDone ? 'none' : `0 2px 20px ${priorityGlow[task.priority] || 'transparent'}`,
      }}
    >
      {/* Left accent bar */}
      {!isDone && (
        <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
          style={{ background: priorityDot[task.priority] || '#6366f1', boxShadow: `0 0 8px ${priorityDot[task.priority]}` }} />
      )}

      <div className="flex items-start gap-4">
        {/* Checkbox-style status indicator */}
        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isDone
            ? 'border-emerald-500 bg-emerald-500/20'
            : 'border-white/15 group-hover:border-white/25'
        }`}>
          {isDone && (
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`badge-${task.priority}`}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: priorityDot[task.priority] }} />
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className={`status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                ⚠ Overdue
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-sm leading-snug mb-1 ${isDone ? 'line-through text-slate-600' : 'text-white'}`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-3">
            {task.dueDate && (
              <span className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-slate-600'}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {task.creator && (
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  {task.creator.name?.[0]?.toUpperCase()}
                </div>
                {task.creator.name}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 translate-x-2 group-hover:translate-x-0">
          {onEdit && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: '#64748b' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: '#64748b' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
