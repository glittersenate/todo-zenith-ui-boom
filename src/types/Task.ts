
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline?: string;
  priority?: "low" | "medium" | "high";
  recurring?: "daily" | "weekly" | "monthly";
}
