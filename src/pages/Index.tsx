import { useState, useEffect } from "react";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import PointsDisplay from "@/components/PointsDisplay";
import GoalSetter from "@/components/GoalSetter";
import PointsAnimation from "@/components/PointsAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import { Task, UserProgress } from "@/types/Task";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    weeklyGoal: 50,
    monthlyGoal: 200,
    currentWeekPoints: 0,
    currentMonthPoints: 0,
    level: 1
  });
  const [pointsAnimation, setPointsAnimation] = useState({ show: false, points: 0 });
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedProgress = localStorage.getItem("userProgress");
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
    
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Add default monthly values if they don't exist
        setUserProgress({
          monthlyGoal: 200,
          currentMonthPoints: 0,
          ...parsed
        });
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const getPointsForPriority = (priority?: string) => {
    switch (priority) {
      case "low": return 3;
      case "medium": return 5;
      case "high": return 7;
      default: return 2;
    }
  };

  const calculateLevel = (totalPoints: number) => {
    return Math.floor(totalPoints / 50) + 1;
  };

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
      prev.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          
          // If task is being completed, award points
          if (!task.completed && updatedTask.completed) {
            const points = getPointsForPriority(task.priority);
            updatedTask.pointsEarned = points;
            updatedTask.completedAt = new Date().toISOString();
            
            // Update user progress
            setUserProgress(prev => {
              const newTotalPoints = prev.totalPoints + points;
              const newLevel = calculateLevel(newTotalPoints);
              return {
                ...prev,
                totalPoints: newTotalPoints,
                currentWeekPoints: prev.currentWeekPoints + points,
                currentMonthPoints: prev.currentMonthPoints + points,
                level: newLevel
              };
            });
            
            // Show points animation
            setPointsAnimation({ show: true, points });
            
            toast({
              title: `Task Completed! +${points} XP 🎉`,
              description: "Keep up the great work!",
            });
          }
          // If task is being uncompleted, remove points
          else if (task.completed && !updatedTask.completed && task.pointsEarned) {
            const points = task.pointsEarned;
            updatedTask.pointsEarned = undefined;
            updatedTask.completedAt = undefined;
            
            setUserProgress(prev => ({
              ...prev,
              totalPoints: Math.max(0, prev.totalPoints - points),
              currentWeekPoints: Math.max(0, prev.currentWeekPoints - points),
              currentMonthPoints: Math.max(0, prev.currentMonthPoints - points),
              level: calculateLevel(Math.max(0, prev.totalPoints - points))
            }));
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const removeTask = (id: string) => {
    const taskToRemove = tasks.find(task => task.id === id);
    if (taskToRemove) {
      setLastDeletedTask(taskToRemove);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // If completed task is removed, subtract points
      if (taskToRemove.completed && taskToRemove.pointsEarned) {
        setUserProgress(prev => ({
          ...prev,
          totalPoints: Math.max(0, prev.totalPoints - taskToRemove.pointsEarned!),
          currentWeekPoints: Math.max(0, prev.currentWeekPoints - taskToRemove.pointsEarned!),
          currentMonthPoints: Math.max(0, prev.currentMonthPoints - taskToRemove.pointsEarned!),
          level: calculateLevel(Math.max(0, prev.totalPoints - taskToRemove.pointsEarned!))
        }));
      }
      
      toast({
        title: "Task Removed",
        description: "Task deleted successfully. You can undo this action.",
      });
    }
  };

  const undoDelete = () => {
    if (lastDeletedTask) {
      setTasks(prev => [lastDeletedTask, ...prev]);
      
      // If the restored task was completed, restore points
      if (lastDeletedTask.completed && lastDeletedTask.pointsEarned) {
        setUserProgress(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + lastDeletedTask.pointsEarned!,
          currentWeekPoints: prev.currentWeekPoints + lastDeletedTask.pointsEarned!,
          currentMonthPoints: prev.currentMonthPoints + lastDeletedTask.pointsEarned!,
          level: calculateLevel(prev.totalPoints + lastDeletedTask.pointsEarned!)
        }));
      }
      
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

  const setWeeklyGoal = (goal: number) => {
    setUserProgress(prev => ({ ...prev, weeklyGoal: goal }));
    toast({
      title: "Weekly Goal Updated! 🎯",
      description: `Your weekly goal is now ${goal} XP!`,
    });
  };

  const setMonthlyGoal = (goal: number) => {
    setUserProgress(prev => ({ ...prev, monthlyGoal: goal }));
    toast({
      title: "Monthly Goal Updated! 🎯",
      description: `Your monthly goal is now ${goal} XP!`,
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? "bg-blue-500" : "bg-blue-400"
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          isDarkMode ? "bg-indigo-500" : "bg-indigo-400"
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
                  ? "from-white to-blue-200" 
                  : "from-gray-800 to-blue-600"
              } bg-clip-text text-transparent`}>
                ✨ NozelTask
              </h1>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <GoalSetter 
              currentWeeklyGoal={userProgress.weeklyGoal}
              currentMonthlyGoal={userProgress.monthlyGoal}
              onSetWeeklyGoal={setWeeklyGoal}
              onSetMonthlyGoal={setMonthlyGoal}
              isDarkMode={isDarkMode}
            />
          </div>
          <p className={`text-xl ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Your gamified task management experience
          </p>
        </div>

        {/* Points Display */}
        <PointsDisplay progress={userProgress} isDarkMode={isDarkMode} />

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
            <div className="text-6xl mb-4">🎮</div>
            <h3 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Ready to earn some XP?
            </h3>
            <p className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Add your first task and start gaining points!
            </p>
          </div>
        )}
      </div>

      {/* Points Animation */}
      <PointsAnimation 
        points={pointsAnimation.points}
        trigger={pointsAnimation.show}
        onComplete={() => setPointsAnimation({ show: false, points: 0 })}
      />
    </div>
  );
};

export default Index;
