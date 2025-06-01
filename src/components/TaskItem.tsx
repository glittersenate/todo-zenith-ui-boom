
import { Task } from "@/types/Task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const TaskItem = ({ task, onToggle, onRemove, isDarkMode, style, className }: TaskItemProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50/50";
      case "medium": return "border-l-yellow-500 bg-yellow-50/50";
      case "low": return "border-l-green-500 bg-green-50/50";
      default: return "border-l-transparent";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "";
    }
  };

  const getRecurringIcon = (recurring?: string) => {
    switch (recurring) {
      case "daily": return "📅";
      case "weekly": return "📆";
      case "monthly": return "🗓️";
      default: return "";
    }
  };

  const getPointsForPriority = (priority?: string) => {
    switch (priority) {
      case "low": return 3;
      case "medium": return 5;
      case "high": return 7;
      default: return 2;
    }
  };

  return (
    <div 
      className={`group p-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] border-l-4 ${
        task.completed 
          ? "opacity-60 scale-95" 
          : "hover:shadow-lg"
      } ${
        isDarkMode 
          ? "bg-white/10 border-r border-t border-b border-white/20" 
          : "bg-white/60 border-r border-t border-b border-white/40"
      } ${getPriorityColor(task.priority)} ${className}`}
      style={style}
    >
      <div className="flex items-center gap-4">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={onToggle}
          className="h-5 w-5"
        />
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium transition-all duration-300 ${
            task.completed 
              ? "line-through text-gray-500" 
              : isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            {task.completed && "✅ "}{task.text}
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
            {/* Points Badge */}
            <Badge className={`${
              task.completed 
                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                : "bg-gradient-to-r from-yellow-500 to-orange-500"
            } text-white`}>
              {task.completed ? `+${task.pointsEarned || getPointsForPriority(task.priority)} XP` : `${getPointsForPriority(task.priority)} XP`}
            </Badge>

            {task.deadline && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
              }`}>
                📅 {format(new Date(task.deadline), "MMM dd")}
              </span>
            )}
            
            {task.priority && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isDarkMode ? "bg-gray-500/20 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
                {getPriorityIcon(task.priority)} {task.priority}
              </span>
            )}
            
            {task.recurring && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isDarkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
              }`}>
                {getRecurringIcon(task.recurring)} {task.recurring}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-100 hover:text-red-600 ${
            isDarkMode ? "text-gray-400 hover:bg-red-900/30 hover:text-red-400" : ""
          }`}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
