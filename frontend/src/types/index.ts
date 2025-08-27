// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'general_fitness';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  createdAt: Date;
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
  muscleGroups: string[];
  equipment?: string;
  instructions?: string;
}

// Set types
export interface Set {
  id: string;
  reps: number;
  weight?: number;
  duration?: number; // for time-based exercises
  restTime?: number; // in seconds
  completed: boolean;
}

// Workout types
export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration?: number; // total workout duration in minutes
  notes?: string;
  completed: boolean;
}

// Timer types
export interface Timer {
  id: string;
  duration: number; // in seconds
  remaining: number;
  isActive: boolean;
  type: 'rest' | 'exercise' | 'workout';
}

// Calorie types
export interface CalorieEntry {
  id: string;
  userId: string;
  date: Date;
  food: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyCalories {
  date: Date;
  entries: CalorieEntry[];
  totalCalories: number;
  goalCalories: number;
  burned: number; // calories burned from workouts
}

// AI Suggestion types
export interface AIWorkoutSuggestion {
  id: string;
  userId: string;
  suggestion: string;
  exercises: Exercise[];
  reasoning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  createdAt: Date;
}

// Progress types
export interface ProgressMetric {
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
