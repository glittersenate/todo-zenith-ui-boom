
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target } from "lucide-react";

interface GoalSetterProps {
  currentGoal: number;
  onSetGoal: (goal: number) => void;
  isDarkMode: boolean;
}

const GoalSetter = ({ currentGoal, onSetGoal, isDarkMode }: GoalSetterProps) => {
  const [newGoal, setNewGoal] = useState(currentGoal.toString());
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseInt(newGoal);
    if (goal > 0) {
      onSetGoal(goal);
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
          Set Weekly Goal
        </Button>
      </DialogTrigger>
      <DialogContent className={`${
        isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95"
      }`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            Set Your Weekly XP Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Weekly Goal (XP Points)
            </label>
            <Input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g., 100"
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Set Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSetter;
