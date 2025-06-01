
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Calendar, CalendarDays } from "lucide-react";

interface GoalSetterProps {
  currentWeeklyGoal: number;
  currentMonthlyGoal: number;
  onSetWeeklyGoal: (goal: number) => void;
  onSetMonthlyGoal: (goal: number) => void;
  isDarkMode: boolean;
}

const GoalSetter = ({ currentWeeklyGoal, currentMonthlyGoal, onSetWeeklyGoal, onSetMonthlyGoal, isDarkMode }: GoalSetterProps) => {
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(currentWeeklyGoal.toString());
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(currentMonthlyGoal.toString());
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weeklyGoal = parseInt(newWeeklyGoal);
    const monthlyGoal = parseInt(newMonthlyGoal);
    if (weeklyGoal > 0 && monthlyGoal > 0) {
      onSetWeeklyGoal(weeklyGoal);
      onSetMonthlyGoal(monthlyGoal);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`${
            isDarkMode 
              ? "border-white/20 bg-white/5 hover:bg-white/10" 
              : "border-gray-300 bg-white/50 hover:bg-white/80"
          }`}
        >
          <Target className="w-4 h-4 mr-2" />
          Set Goals
        </Button>
      </DialogTrigger>
      <DialogContent className={`${
        isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95"
      }`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Set Your XP Goals
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              <Calendar className="w-4 h-4" />
              Weekly Goal (XP Points)
            </label>
            <Input
              type="number"
              value={newWeeklyGoal}
              onChange={(e) => setNewWeeklyGoal(e.target.value)}
              placeholder="e.g., 50"
              className={`${
                isDarkMode 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-white border-gray-300"
              }`}
              min="1"
              required
            />
          </div>
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              <CalendarDays className="w-4 h-4" />
              Monthly Goal (XP Points)
            </label>
            <Input
              type="number"
              value={newMonthlyGoal}
              onChange={(e) => setNewMonthlyGoal(e.target.value)}
              placeholder="e.g., 200"
              className={`${
                isDarkMode 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-white border-gray-300"
              }`}
              min="1"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Set Goals
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSetter;
