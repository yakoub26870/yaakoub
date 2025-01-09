import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { TaskStatus } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { TaskColumn } from './TaskColumn';

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard: React.FC = () => {
  const { tasks, moveTask } = useTaskStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      moveTask(taskId, newStatus);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
    </DndContext>
  );
};