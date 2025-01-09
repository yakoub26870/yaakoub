import React, { useState } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { useTaskStore } from '../store/taskStore';
import { TaskForm } from './TaskForm';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });
  const { deleteTask } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => handleEdit(task)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>

      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};