export interface WorkoutStep {
  label: string;
  seconds: number;
}

export interface Workout {
  id: string;
  title: string;
  minutes: number;
  ageMin: number;
  tags: string[];
  steps: WorkoutStep[];
}
