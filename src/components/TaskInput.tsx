
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskInputProps {
  onAddTask: (text: string, deadline?: string, priority?: string, recurring?: string) => void;
  onUndoDelete: () => void;
  isDarkMode: boolean;
}

const TaskInput = ({ onAddTask, onUndoDelete, isDarkMode }: TaskInputProps) => {
  const [taskText, setTaskText] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [priority, setPriority] = useState<string>("");
  const [recurring, setRecurring] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(
        taskText.trim(),
        deadline ? format(deadline, "yyyy-MM-dd") : undefined,
        priority || undefined,
        recurring || undefined
      );
      setTaskText("");
      setDeadline(undefined);
      setPriority("");
      setRecurring("");
      setShowAdvanced(false);
    }
  };

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-md transition-all duration-300 ${
      isDarkMode 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-white/40"
    }`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="✨ What needs to be done today?"
            className={`flex-1 h-14 text-lg rounded-2xl border-0 ${
              isDarkMode 
                ? "bg-white/10 text-white placeholder:text-gray-400" 
                : "bg-white/80 text-gray-800 placeholder:text-gray-500"
            }`}
          />
          <Button 
            type="submit" 
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Add Task
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}`}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
          
          <Button
            type="button"
            onClick={onUndoDelete}
            variant="ghost"
            className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}`}
          >
            ↩️ Undo Delete
          </Button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/10 animate-fade-in">
            {/* Deadline Picker */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl",
                      !deadline && "text-muted-foreground",
                      isDarkMode ? "border-white/20 bg-white/5" : "border-gray-300 bg-white/50"
                    )}
                  >
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Priority Selector */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Priority
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className={`rounded-xl ${
                  isDarkMode ? "border-white/20 bg-white/5" : "border-gray-300 bg-white/50"
                }`}>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Selector */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Repeat
              </label>
              <Select value={recurring} onValueChange={setRecurring}>
                <SelectTrigger className={`rounded-xl ${
                  isDarkMode ? "border-white/20 bg-white/5" : "border-gray-300 bg-white/50"
                }`}>
                  <SelectValue placeholder="No repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">📅 Daily</SelectItem>
                  <SelectItem value="weekly">📆 Weekly</SelectItem>
                  <SelectItem value="monthly">🗓️ Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskInput;
