
import { Task } from "@/types/Task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  isDarkMode: boolean;
}

const TaskList = ({ tasks, onToggleTask, onRemoveTask, isDarkMode }: TaskListProps) => {
  // Sort tasks: incomplete first, then by priority, then by date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = a.priority ? priorityOrder[a.priority] : 3;
    const bPriority = b.priority ? priorityOrder[b.priority] : 3;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onRemove={() => onRemoveTask(task.id)}
          isDarkMode={isDarkMode}
          style={{
            animationDelay: `${index * 0.1}s`
          }}
          className="animate-fade-in"
        />
      ))}
    </div>
  );
};

export default TaskList;
