
import { UserProgress } from "@/types/Task";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap } from "lucide-react";

interface PointsDisplayProps {
  progress: UserProgress;
  isDarkMode: boolean;
}

const PointsDisplay = ({ progress, isDarkMode }: PointsDisplayProps) => {
  const weeklyProgress = (progress.currentWeekPoints / progress.weeklyGoal) * 100;
  const pointsToNextLevel = ((progress.level + 1) * 50) - progress.totalPoints;

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-md mb-8 ${
      isDarkMode 
        ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30" 
        : "bg-gradient-to-r from-purple-100/80 to-pink-100/80 border border-purple-200/50"
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Points */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className={`w-6 h-6 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} />
            <div className={`text-3xl font-bold bg-gradient-to-r ${
              isDarkMode 
                ? "from-yellow-400 to-orange-400" 
                : "from-yellow-600 to-orange-600"
            } bg-clip-text text-transparent`}>
              {progress.totalPoints}
            </div>
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Total XP
          </div>
        </div>

        {/* Level */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className={`w-6 h-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
            <div className={`text-3xl font-bold ${
              isDarkMode ? "text-purple-400" : "text-purple-600"
            }`}>
              {progress.level}
            </div>
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Level
          </div>
          <div className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            {pointsToNextLevel} XP to next level
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className={`w-6 h-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
            <div className={`text-3xl font-bold ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}>
              {progress.currentWeekPoints}
            </div>
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            This Week
          </div>
          <div className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Goal: {progress.weeklyGoal} XP
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}>
            {Math.round(weeklyProgress)}%
          </div>
          <div className={`text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Weekly Progress
          </div>
          <Progress 
            value={weeklyProgress} 
            className={`h-2 ${
              isDarkMode ? "bg-white/20" : "bg-gray-200"
            }`}
          />
          {weeklyProgress >= 100 && (
            <Badge className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
              🎉 Goal Achieved!
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;
