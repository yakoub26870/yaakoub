import React from 'react';
import { Task } from '../types/task';
import { Calendar, Clock, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-gray-600 mb-3">{task.description}</p>
      
      <div className="space-y-2">
        {task.due_date && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(task.due_date), 'PP')}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>{format(new Date(task.created_at), 'PP')}</span>
        </div>
        
        {totalItems > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <CheckSquare className="w-4 h-4 mr-2" />
            <span>{completedItems}/{totalItems} completed</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {task.labels.map((label, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};