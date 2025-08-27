import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Workout, WorkoutExercise, LoadingState} from "../../types"


interface WorkoutState extends LoadingState {
    workouts: Workout[];
    currentWorkout: Workout | null;
    isWorkoutActive: boolean;
}