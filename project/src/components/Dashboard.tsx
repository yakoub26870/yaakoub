import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks } = useTaskStore();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  };

  const calculatePercentage = (value: number) => {
    return stats.total ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.completed} ({calculatePercentage(stats.completed)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.inProgress} ({calculatePercentage(stats.inProgress)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High Priority</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.highPriority} ({calculatePercentage(stats.highPriority)}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};