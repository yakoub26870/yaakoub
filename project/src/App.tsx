import React, { useEffect, useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { TaskForm } from './components/TaskForm';
import { AuthForm } from './components/AuthForm';
import { useTaskStore } from './store/taskStore';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon, LogOut, Plus, LayoutDashboard, Kanban } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [view, setView] = useState<'dashboard' | 'kanban'>('dashboard');
  const [taskToEdit, setTaskToEdit] = useState<any>(null); // Tâche à modifier

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchTasks();
      }
    });

    return () => unsubscribe();
  }, [fetchTasks]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleEditTask = (task: any) => {
    setTaskToEdit(task); // Charger la tâche à modifier
    setShowTaskForm(true); // Afficher le formulaire de modification
  };

  const handleSaveTask = (task: any) => {
    // Logic to save the task (for example, calling updateTask)
    updateTask(task);
    setTaskToEdit(null); // Clear the task to edit
  };

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('dashboard')}
              className={`p-2 rounded-lg ${
                view === 'dashboard'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              } shadow-md`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-lg ${
                view === 'kanban'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              } shadow-md`}
            >
              <Kanban className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        <main className="py-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {view === 'dashboard' ? 'Dashboard' : 'Kanban Board'}
            </h2>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>

          {view === 'dashboard' ? <Dashboard /> : <KanbanBoard />}

          <div className="task-list mt-8">
            {tasks.map((task) => (
              <div key={task.id} className="task-item mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl text-gray-800 dark:text-white">{task.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                <div className="flex gap-4 mt-4">
                  {/* Bouton Editer */}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    Edit
                  </button>
                  
                  {/* Bouton Supprimer */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>

                  {/* Bouton Enregistrer */}
                  <button
                    onClick={() => handleSaveTask(task)} // Appel de la fonction pour enregistrer la tâche
                    className="text-green-500 hover:text-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showTaskForm && (
            <TaskForm
              taskToEdit={taskToEdit}
              onClose={() => setShowTaskForm(false)}
              onSave={(task) => {
                if (taskToEdit) {
                  updateTask(task);
                } else {
                  addTask(task);
                }
                setShowTaskForm(false);
                setTaskToEdit(null);
              }}
            />
          )}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
