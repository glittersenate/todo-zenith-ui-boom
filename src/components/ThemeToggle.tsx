
import { Switch } from "@/components/ui/switch";

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const ThemeToggle = ({ isDarkMode, setIsDarkMode }: ThemeToggleProps) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl backdrop-blur-md ${
      isDarkMode 
        ? "bg-white/10 border border-white/20" 
        : "bg-white/60 border border-white/40"
    }`}>
      <span className="text-2xl">{isDarkMode ? "🌙" : "☀️"}</span>
      <Switch 
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
      />
      <span className={`text-sm font-medium ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}>
        {isDarkMode ? "Dark" : "Light"}
      </span>
    </div>
  );
};

export default ThemeToggle;
