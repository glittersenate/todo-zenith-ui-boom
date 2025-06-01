
interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  isDarkMode: boolean;
}

const TaskStats = ({ totalTasks, completedTasks, isDarkMode }: TaskStatsProps) => {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-md mb-8 ${
      isDarkMode 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-white/40"
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            {totalTasks}
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Total Tasks
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}>
            {completedTasks}
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Completed
          </div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}>
            {Math.round(completionPercentage)}%
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Progress
          </div>
          <div className={`w-[85%] mx-auto h-2 rounded-full mt-2 ${
            isDarkMode ? "bg-white/20" : "bg-gray-200"
          }`}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
