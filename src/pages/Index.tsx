
import { useState, useEffect } from "react";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import ThemeToggle from "@/components/ThemeToggle";
import { Task } from "@/types/Task";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText: string, deadline?: string, priority?: string, recurring?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline,
      priority: priority as "low" | "medium" | "high" | undefined,
      recurring: recurring as "daily" | "weekly" | "monthly" | undefined,
    };

    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task Added! 🎉",
      description: "Your task has been successfully added to the list.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: string) => {
    const taskToRemove = tasks.find(task => task.id === id);
    if (taskToRemove) {
      setLastDeletedTask(taskToRemove);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task Removed",
        description: "Task deleted successfully. You can undo this action.",
      });
    }
  };

  const undoDelete = () => {
    if (lastDeletedTask) {
      setTasks(prev => [lastDeletedTask, ...prev]);
      setLastDeletedTask(null);
      toast({
        title: "Task Restored! ↩️",
        description: "Your task has been restored successfully.",
      });
    } else {
      toast({
        title: "Nothing to Undo",
        description: "No recently deleted task to restore.",
        variant: "destructive",
      });
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? "bg-purple-500" : "bg-blue-400"
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? "bg-pink-500" : "bg-indigo-400"
        }`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl backdrop-blur-md ${
              isDarkMode 
                ? "bg-white/10 border border-white/20" 
                : "bg-white/60 border border-white/40"
            }`}>
              <h1 className={`text-5xl font-bold bg-gradient-to-r ${
                isDarkMode 
                  ? "from-white to-purple-200" 
                  : "from-gray-800 to-purple-600"
              } bg-clip-text text-transparent`}>
                ✨ TaskFlow
              </h1>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
          <p className={`text-xl ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Your beautiful, modern task management experience
          </p>
        </div>

        {/* Stats */}
        <TaskStats 
          totalTasks={totalTasks} 
          completedTasks={completedTasks} 
          isDarkMode={isDarkMode}
        />

        {/* Task Input */}
        <div className="mb-8">
          <TaskInput onAddTask={addTask} onUndoDelete={undoDelete} isDarkMode={isDarkMode} />
        </div>

        {/* Task List */}
        <TaskList 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          onRemoveTask={removeTask} 
          isDarkMode={isDarkMode}
        />

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className={`text-center py-16 rounded-3xl backdrop-blur-md ${
            isDarkMode 
              ? "bg-white/5 border border-white/10" 
              : "bg-white/40 border border-white/60"
          }`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              No tasks yet!
            </h3>
            <p className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Add your first task above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
