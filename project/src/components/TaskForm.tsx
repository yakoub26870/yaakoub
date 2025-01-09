import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { Plus, X, Calendar } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [label, setLabel] = useState('');
  const [labels, setLabels] = useState<string[]>(task?.labels || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      priority,
      status,
      due_date: dueDate,
      labels,
      checklist: task?.checklist || []
    };

    if (task) {
      await updateTask(task.id, taskData);
    } else {
      await addTask(taskData);
    }
    onClose();
  };

  const addLabel = () => {
    if (label.trim() && !labels.includes(label.trim())) {
      setLabels([...labels, label.trim()]);
      setLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Labels
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a label"
              />
              <button
                type="button"
                onClick={addLabel}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {labels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="ml-2 inline-flex items-center p-0.5 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
