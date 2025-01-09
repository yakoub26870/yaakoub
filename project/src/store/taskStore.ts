import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        set({ tasks, error: null });
      }, (error) => {
        set({ error: error.message });
      });

      // Clean up listener when store is destroyed
      return () => unsubscribe();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (task) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await addDoc(collection(db, 'tasks'), {
        ...task,
        user_id: user.uid,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTask: async (id, updates) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTask: async (id) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  moveTask: async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));