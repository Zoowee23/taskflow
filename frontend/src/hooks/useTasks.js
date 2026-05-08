import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, sortBy: 'createdAt', order: 'DESC', ...initialFilters });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.getTasks(filters);
      setTasks(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await taskService.createTask(data);
    toast.success('Task created');
    fetchTasks();
    return res.data.data;
  };

  const updateTask = async (id, data) => {
    const res = await taskService.updateTask(id, data);
    toast.success('Task updated');
    fetchTasks();
    return res.data.data;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    toast.success('Task deleted');
    fetchTasks();
  };

  return { tasks, meta, loading, filters, setFilters, createTask, updateTask, deleteTask, refetch: fetchTasks };
};
