export interface StepAnimation {
  src: string;
  creditLabel: string;
  creditUrl: string;
}

export interface WorkoutStep {
  label: string;
  seconds: number;
  animationKey?: string;
  animation?: StepAnimation;
}

export interface Workout {
  id: string;
  title: string;
  minutes: number;
  ageMin: number;
  tags: string[];
  steps: WorkoutStep[];
}
