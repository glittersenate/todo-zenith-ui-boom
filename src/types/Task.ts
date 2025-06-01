
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline?: string;
  priority?: "low" | "medium" | "high";
  recurring?: "daily" | "weekly" | "monthly";
  pointsEarned?: number;
  completedAt?: string;
}

export interface UserProgress {
  totalPoints: number;
  weeklyGoal: number;
  monthlyGoal: number;
  currentWeekPoints: number;
  currentMonthPoints: number;
  level: number;
}
